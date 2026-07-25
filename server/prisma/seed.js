require("dotenv").config();
const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

const providersData = [
  {
    fullName: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    phone: "111-222-3333",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    role: "PROVIDER"
  },
  {
    fullName: "David Miller",
    email: "david.miller@example.com",
    phone: "222-333-4444",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    role: "PROVIDER"
  },
  {
    fullName: "Marcus Vance",
    email: "marcus.vance@example.com",
    phone: "333-444-5555",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    role: "PROVIDER"
  },
  {
    fullName: "Robert Garcia",
    email: "robert.garcia@example.com",
    phone: "444-555-6666",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    role: "PROVIDER"
  },
  {
    fullName: "Emily Taylor",
    email: "emily.taylor@example.com",
    phone: "555-666-7777",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    role: "PROVIDER"
  },
  {
    fullName: "Chloe Bennett",
    email: "chloe.bennett@example.com",
    phone: "666-777-8888",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    role: "PROVIDER"
  },
  {
    fullName: "Jessica Alba",
    email: "jessica.alba@example.com",
    phone: "777-888-9999",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
    role: "PROVIDER"
  },
  {
    fullName: "Thomas Wright",
    email: "thomas.wright@example.com",
    phone: "888-999-0000",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    role: "PROVIDER"
  },
  {
    fullName: "Alan Turing",
    email: "alan.turing@example.com",
    phone: "999-000-1111",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
    role: "PROVIDER"
  },
  {
    fullName: "Swift Transports",
    email: "swift.transports@example.com",
    phone: "000-111-2222",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
    role: "PROVIDER"
  },
  {
    fullName: "Gary Woods",
    email: "gary.woods@example.com",
    phone: "123-456-7890",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&h=150&q=80",
    role: "PROVIDER"
  },
  {
    fullName: "Alex Mercer",
    email: "alex.mercer@example.com",
    phone: "987-654-3210",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=150&h=150&q=80",
    role: "PROVIDER"
  }
];

const servicesData = [
  {
    title: "Deep Home Cleaning Service",
    slug: "deep-home-cleaning-service",
    category: "Home Cleaning",
    providerName: "Sarah Jenkins",
    location: "Brooklyn, NY",
    rating: 4.9,
    reviewCount: 142,
    price: 35.0,
    priceType: "/hr",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    description: "Complete top-to-bottom cleaning of all rooms including dusting, vacuuming, kitchen sanitization, and window washing.",
    availability: "today",
    badge: "Top Rated"
  },
  {
    title: "Expert Plumbing & Leak Repair",
    slug: "expert-plumbing-leak-repair",
    category: "Plumbing",
    providerName: "David Miller",
    location: "Queens, NY",
    rating: 4.8,
    reviewCount: 98,
    price: 50.0,
    priceType: "/hr",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    description: "Resolving leakages, clogged drains, toilet repairs, pipe installations, and hot water heater repair with guarantee.",
    availability: "this-week",
    badge: "Verified"
  },
  {
    title: "Licensed Smart Home Wiring",
    slug: "licensed-smart-home-wiring",
    category: "Electrical",
    providerName: "Marcus Vance",
    location: "Manhattan, NY",
    rating: 4.9,
    reviewCount: 115,
    price: 65.0,
    priceType: "/hr",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    description: "Installation of smart lighting panels, smart thermostats, EV charger setups, and general home electrical upgrades.",
    availability: "today",
    badge: "Top Rated"
  },
  {
    title: "Local Office & Home Moving Pro",
    slug: "local-office-home-moving-pro",
    category: "Moving & Packing",
    providerName: "Robert Garcia",
    location: "Brooklyn, NY",
    rating: 4.7,
    reviewCount: 78,
    price: 80.0,
    priceType: "/hr",
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80",
    description: "Reliable packing, secure loading, transit, and careful unloading services with optional premium protective wrapping.",
    availability: "weekend",
    badge: ""
  },
  {
    title: "Premium Lawn Care & Landscaping",
    slug: "premium-lawn-care-landscaping",
    category: "Lawn & Garden",
    providerName: "Emily Taylor",
    location: "Staten Island, NY",
    rating: 4.6,
    reviewCount: 45,
    price: 40.0,
    priceType: "/hr",
    imageUrl: "https://images.unsplash.com/photo-1558905619-1715497e68c6?auto=format&fit=crop&w=600&q=80",
    description: "Lawn mowing, branch pruning, landscape designing, fertilization, weed prevention, and sod installation.",
    availability: "this-week",
    badge: "New"
  },
  {
    title: "Swedish Massage & Reflexology",
    slug: "swedish-massage-reflexology",
    category: "Wellness & Personal",
    providerName: "Chloe Bennett",
    location: "Manhattan, NY",
    rating: 4.9,
    reviewCount: 89,
    price: 90.0,
    priceType: "/hr",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    description: "Relaxing Swedish massage, warm oil aromatherapy, deep tissue therapy, and reflexology sessions at your location.",
    availability: "weekend",
    badge: "Top Rated"
  },
  {
    title: "Eco-Friendly House Cleaning",
    slug: "eco-friendly-house-cleaning",
    category: "Home Cleaning",
    providerName: "Jessica Alba",
    location: "Manhattan, NY",
    rating: 4.8,
    reviewCount: 62,
    price: 38.0,
    priceType: "/hr",
    imageUrl: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80",
    description: "Eco-friendly cleaning with organic, biodegradable solutions safe for children, seniors, and domestic pets.",
    availability: "this-week",
    badge: "Eco Friendly"
  },
  {
    title: "Emergency 24/7 Plumber Pro",
    slug: "emergency-247-plumber-pro",
    category: "Plumbing",
    providerName: "Thomas Wright",
    location: "Bronx, NY",
    rating: 4.5,
    reviewCount: 34,
    price: 70.0,
    priceType: "/hr",
    imageUrl: "https://images.unsplash.com/photo-1607472586893-edb5caba0c55?auto=format&fit=crop&w=600&q=80",
    description: "Sewer backups, frozen pipes, sudden boiler issues, and major pipe leaks. Prompt response in under 60 minutes.",
    availability: "today",
    badge: "Emergency"
  },
  {
    title: "Commercial Electrical Service",
    slug: "commercial-electrical-service",
    category: "Electrical",
    providerName: "Alan Turing",
    location: "Queens, NY",
    rating: 4.7,
    reviewCount: 51,
    price: 75.0,
    priceType: "/hr",
    imageUrl: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80",
    description: "Wiring layout designs, commercial building power distribution systems, inspections, and high-voltage repairs.",
    availability: "this-week",
    badge: ""
  },
  {
    title: "Interstate Moving Solutions",
    slug: "interstate-moving-solutions",
    category: "Moving & Packing",
    providerName: "Swift Transports",
    location: "Bronx, NY",
    rating: 4.9,
    reviewCount: 104,
    price: 120.0,
    priceType: "/hr",
    imageUrl: "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=600&q=80",
    description: "Full interstate moves, specialized furniture protection, vehicle transportation, and secured warehouse storage.",
    availability: "weekend",
    badge: "Top Rated"
  },
  {
    title: "Hedge Trimming & Tree Removal",
    slug: "hedge-trimming-tree-removal",
    category: "Lawn & Garden",
    providerName: "Gary Woods",
    location: "Staten Island, NY",
    rating: 4.8,
    reviewCount: 82,
    price: 55.0,
    priceType: "/hr",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    description: "Verified arborists offering tree felling, hedge maintenance, root removal, and green garden cleanup.",
    availability: "weekend",
    badge: "Verified"
  },
  {
    title: "1-on-1 Personal Fitness Coaching",
    slug: "1-on-1-personal-fitness-coaching",
    category: "Wellness & Personal",
    providerName: "Alex Mercer",
    location: "Brooklyn, NY",
    rating: 4.9,
    reviewCount: 73,
    price: 60.0,
    priceType: "/hr",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
    description: "Customized workout blueprints, strength training, core stability improvement, and custom nutritional programs.",
    availability: "today",
    badge: "New"
  }
];

async function main() {
  console.log("🌱 Start seeding...");

  const hashedPassword = await bcrypt.hash("Password123", 10);

  // 1. Seed Providers
  const providerMap = {};
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
          role: prov.role,
          avatar: prov.avatar,
          isVerified: true
        }
      });
      console.log(`Created provider: ${prov.fullName}`);
    } else {
      console.log(`Provider already exists: ${prov.fullName}`);
    }

    providerMap[prov.fullName] = user.id;
  }

  // 1b. Seed Admin User
  const adminEmail = "bookmylocalservice@gmail.com";
  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        fullName: "System Admin",
        email: adminEmail,
        phone: "000-999-8888",
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true
      }
    });
    console.log(`Created admin user: ${adminEmail}`);
  } else {
    // Ensure role is ADMIN
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "ADMIN", password: hashedPassword, isVerified: true }
    });
    console.log(`Admin user ${adminEmail} updated to ADMIN role`);
  }

  // 2. Seed Services
  for (const s of servicesData) {
    const providerId = providerMap[s.providerName];
    if (!providerId) {
      console.error(`Could not find providerId for service: ${s.title}`);
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
          rating: s.rating,
          reviewCount: s.reviewCount,
          availability: s.availability,
          badge: s.badge || null,
          imageUrl: s.imageUrl
        }
      });
      console.log(`Created service: ${s.title}`);
    } else {
      console.log(`Service already exists: ${s.title}`);
    }
  }

  // 3. Seed Default Customer
  let customer = await prisma.user.findUnique({
    where: { email: "customer@example.com" }
  });

  if (!customer) {
    customer = await prisma.user.create({
      data: {
        fullName: "Test Customer",
        email: "customer@example.com",
        phone: "999-888-7777",
        password: hashedPassword,
        role: "CUSTOMER",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        isVerified: true
      }
    });
    console.log("Created test customer: customer@example.com");
  } else {
    console.log("Test customer already exists");
  }

  // 4. Seed Bookings
  const seedBookings = [
    {
      id: "BMLS-28491",
      serviceSlug: "deep-home-cleaning-service",
      providerName: "Sarah Jenkins",
      plan: "Deep Clean Premium",
      date: "2026-07-15",
      time: "09:30 AM",
      price: 55.00,
      status: "upcoming",
      paymentStatus: "paid",
      paymentMethod: "card"
    },
    {
      id: "BMLS-19402",
      serviceSlug: "expert-plumbing-leak-repair",
      providerName: "David Miller",
      plan: "Standard Clog/Repair",
      date: "2026-07-03",
      time: "02:00 PM",
      price: 75.00,
      status: "completed",
      paymentStatus: "paid",
      paymentMethod: "card"
    },
    {
      id: "BMLS-10943",
      serviceSlug: "licensed-smart-home-wiring",
      providerName: "Marcus Vance",
      plan: "Smart Device Install",
      date: "2026-06-25",
      time: "11:30 AM",
      price: 95.00,
      status: "cancelled",
      paymentStatus: "refunded",
      paymentMethod: "upi"
    },
    {
      id: "BMLS-88392",
      serviceSlug: "eco-friendly-house-cleaning",
      providerName: "Jessica Alba",
      plan: "Express Dust & Wipe",
      date: "2026-06-18",
      time: "08:00 AM",
      price: 38.00,
      status: "completed",
      paymentStatus: "paid",
      paymentMethod: "cash"
    },
    {
      id: "BMLS-58392",
      serviceSlug: "premium-lawn-care-landscaping",
      providerName: "Emily Taylor",
      plan: "Lawn & Shrub Maintenance",
      date: "2026-07-20",
      time: "04:30 PM",
      price: 60.00,
      status: "upcoming",
      paymentStatus: "paid",
      paymentMethod: "wallet"
    }
  ];

  for (const b of seedBookings) {
    const existingBooking = await prisma.booking.findUnique({
      where: { id: b.id }
    });

    if (!existingBooking) {
      const service = await prisma.service.findUnique({
        where: { slug: b.serviceSlug }
      });
      const providerId = providerMap[b.providerName];

      if (!service || !providerId) {
        console.error(`Cannot seed booking ${b.id}: service or provider not found.`);
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
          customerId: customer.id,
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
          billingName: "Test Customer",
          billingEmail: "customer@example.com",
          billingPhone: "999-888-7777",
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001"
        }
      });
      console.log(`Created seeded booking: ${b.id}`);
    } else {
      console.log(`Seeded booking already exists: ${b.id}`);
    }
  }

  console.log("✅ Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
