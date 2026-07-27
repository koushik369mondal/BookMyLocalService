require("dotenv").config();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");

/**
 * Helper function to load JSON seed data files.
 * Supports configurable dataset directory via SEED_DATASET env variable.
 */
function loadSeedData(fileName) {
  const datasetDir = process.env.SEED_DATASET || "seed-data";
  const filePath = path.join(__dirname, datasetDir, fileName);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Warning: Seed file ${fileName} not found at ${filePath}. Returning empty array.`);
    return [];
  }

  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`❌ Error reading JSON file ${filePath}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log("🌱 Starting Prisma database seeding...");

  // Load JSON datasets
  const providersData = loadSeedData("providers.json");
  const usersData = loadSeedData("users.json");
  const servicesData = loadSeedData("services.json");
  const bookingsData = loadSeedData("bookings.json");

  const hashedPassword = await bcrypt.hash("Password123", 10);

  // 1. Seed Provider Users
  const providerMap = {};
  console.log(`\n--- Seeding ${providersData.length} Providers ---`);
  for (const prov of providersData) {
    let user = await prisma.user.findUnique({
      where: { email: prov.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          fullName: prov.fullName,
          email: prov.email,
          phone: prov.phone,
          password: hashedPassword,
          role: prov.role || "PROVIDER",
          avatar: prov.avatar,
          isVerified: true
        }
      });
      console.log(`  + Created provider: ${prov.fullName} (${prov.email})`);
    } else {
      console.log(`  ~ Provider already exists: ${prov.fullName}`);
    }

    providerMap[prov.fullName] = user.id;
  }

  // 2. Seed System & Customer Users from users.json
  const userMap = {};
  console.log(`\n--- Seeding ${usersData.length} System/Customer Users ---`);
  for (const u of usersData) {
    let user = await prisma.user.findUnique({
      where: { email: u.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          fullName: u.fullName,
          email: u.email,
          phone: u.phone,
          password: hashedPassword,
          role: u.role || "CUSTOMER",
          avatar: u.avatar || null,
          isVerified: u.isVerified !== undefined ? u.isVerified : true
        }
      });
      console.log(`  + Created user: ${u.fullName} [${u.role}]`);
    } else {
      // If user exists, ensure proper role configuration
      user = await prisma.user.update({
        where: { email: u.email },
        data: {
          role: u.role,
          password: hashedPassword,
          isVerified: true
        }
      });
      console.log(`  ~ User already exists (updated): ${u.fullName} [${u.role}]`);
    }

    userMap[u.email] = user.id;
  }

  // Fallback check for default customer id
  let defaultCustomer = await prisma.user.findFirst({
    where: { role: "CUSTOMER" }
  });

  // 3. Seed Services
  console.log(`\n--- Seeding ${servicesData.length} Services ---`);
  for (const s of servicesData) {
    const providerId = providerMap[s.providerName];
    if (!providerId) {
      console.error(`  ❌ Failed to seed service '${s.title}': Provider '${s.providerName}' not found in database.`);
      continue;
    }

    const existingService = await prisma.service.findUnique({
      where: { slug: s.slug }
    });

    if (!existingService) {
      await prisma.service.create({
        data: {
          title: s.title,
          slug: s.slug,
          description: s.description,
          category: s.category,
          providerId,
          location: s.location,
          price: s.price,
          priceType: s.priceType,
          rating: s.rating || 5.0,
          reviewCount: s.reviewCount || 0,
          availability: s.availability,
          badge: s.badge || null,
          imageUrl: s.imageUrl
        }
      });
      console.log(`  + Created service: ${s.title}`);
    } else {
      console.log(`  ~ Service already exists: ${s.title}`);
    }
  }

  // 4. Seed Bookings
  console.log(`\n--- Seeding ${bookingsData.length} Bookings ---`);
  for (const b of bookingsData) {
    const existingBooking = await prisma.booking.findUnique({
      where: { id: b.id }
    });

    if (!existingBooking) {
      const service = await prisma.service.findUnique({
        where: { slug: b.serviceSlug }
      });
      const providerId = providerMap[b.providerName];
      const customerId = userMap[b.customerEmail] || defaultCustomer?.id;

      if (!service || !providerId || !customerId) {
        console.error(`  ❌ Failed to seed booking '${b.id}': Missing relation (service, provider, or customer).`);
        continue;
      }

      const basePrice = b.price;
      const platformFee = 4.99;
      const tax = Math.round(basePrice * 0.085 * 100) / 100;
      const discount = 0.0;
      const total = Math.round((basePrice + platformFee + tax - discount) * 100) / 100;

      await prisma.booking.create({
        data: {
          id: b.id,
          customerId,
          serviceId: service.id,
          providerId,
          plan: b.plan,
          date: b.date,
          time: b.time,
          price: basePrice,
          platformFee,
          tax,
          discount,
          total,
          status: b.status,
          paymentStatus: b.paymentStatus,
          paymentMethod: b.paymentMethod,
          billingName: b.billingName || "Test Customer",
          billingEmail: b.billingEmail || b.customerEmail,
          billingPhone: b.billingPhone || "999-888-7777",
          street: b.street || "123 Main St",
          city: b.city || "New York",
          state: b.state || "NY",
          zipCode: b.zipCode || "10001"
        }
      });
      console.log(`  + Created booking: ${b.id}`);
    } else {
      console.log(`  ~ Booking already exists: ${b.id}`);
    }
  }

  console.log("\n✅ Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
