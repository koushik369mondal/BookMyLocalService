const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const categoriesToSeed = [
  {
    name: "Home Cleaning",
    slug: "home-cleaning",
    icon: "Sparkles",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
    description: "Deep house cleaning, kitchen & bathroom sanitization, floor scrubbing, and move-in/out cleanup."
  },
  {
    name: "Plumbing",
    slug: "plumbing",
    icon: "Droplet",
    imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=600",
    description: "Pipe leak repairs, drain unclogging, faucet replacement, water heater fixes, and toilet repairs."
  },
  {
    name: "Electrical",
    slug: "electrical",
    icon: "Zap",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600",
    description: "Wiring, switch & socket installation, ceiling fan, breaker panel upgrades, and light fixture setups."
  },
  {
    name: "AC & Appliance Repair",
    slug: "ac-appliance-repair",
    icon: "Wind",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
    description: "AC servicing & gas refilling, refrigerator, washing machine, microwave, and TV repairs."
  },
  {
    name: "Painting & Decorating",
    slug: "painting-decorating",
    icon: "Paintbrush",
    imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600",
    description: "Interior & exterior wall painting, waterproof coating, texture painting, and wallpaper installation."
  },
  {
    name: "Moving & Packing",
    slug: "moving-packing",
    icon: "Truck",
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=600",
    description: "Local & long-distance home relocation, office moves, bubble wrapping, and secure transport."
  },
  {
    name: "Carpentry & Woodwork",
    slug: "carpentry-woodwork",
    icon: "Hammer",
    imageUrl: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=600",
    description: "Custom furniture crafting, door lock & hinge repairs, cabinet installation, and wood polishing."
  },
  {
    name: "Pest Control",
    slug: "pest-control",
    icon: "Bug",
    imageUrl: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&q=80&w=600",
    description: "Termite treatment, cockroach control, bed bug eradication, and mosquito fogging services."
  },
  {
    name: "Home Maintenance & Handyman",
    slug: "home-maintenance",
    icon: "Wrench",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600",
    description: "General handyman repairs, curtain rod hanging, shelf mounting, and structural touchups."
  },
  {
    name: "Security & CCTV",
    slug: "security-cctv",
    icon: "Shield",
    imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600",
    description: "CCTV camera installation, smart video doorbells, biometric locks, and security system setup."
  },
  {
    name: "Computer Repair & IT",
    slug: "computer-repair",
    icon: "Monitor",
    imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=600",
    description: "Laptop hardware repair, OS installation, virus removal, Wi-Fi setup, and data recovery."
  },
  {
    name: "Mobile Repair",
    slug: "mobile-repair",
    icon: "Smartphone",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600",
    description: "Screen replacement, battery replacement, charging port fix, and water damage repair."
  },
  {
    name: "Car Services & Detailing",
    slug: "car-services",
    icon: "Car",
    imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=600",
    description: "Doorstep car wash, ceramic coating, battery replacement, oil change, and interior detailing."
  },
  {
    name: "Bike Services",
    slug: "bike-services",
    icon: "Bike",
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600",
    description: "Two-wheeler servicing, chain lubrication, brake repair, breakdown assistance, and tuning."
  },
  {
    name: "Locksmith Services",
    slug: "locksmith-services",
    icon: "Key",
    imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=600",
    description: "Emergency lockout opening, key duplication, safe opening, and digital lock installation."
  },
  {
    name: "Water Services & Purifier",
    slug: "water-services",
    icon: "GlassWater",
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4e?auto=format&fit=crop&q=80&w=600",
    description: "RO water purifier servicing, filter replacement, water tank cleaning, and softener setup."
  },
  {
    name: "Gas Stove & Kitchen Appliance",
    slug: "gas-kitchen-appliance",
    icon: "Flame",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600",
    description: "Gas stove burner repair, gas pipeline leak check, chimney cleaning, and hob servicing."
  },
  {
    name: "Furniture Assembly & Repair",
    slug: "furniture-services",
    icon: "Sofa",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600",
    description: "Flat-pack furniture assembly (IKEA, etc.), sofa re-upholstery, and table/bed repair."
  },
  {
    name: "Child Care & Babysitting",
    slug: "child-care",
    icon: "Baby",
    imageUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600",
    description: "Verified babysitters, infant nannies, after-school child care, and emergency babysitting."
  },
  {
    name: "Elder Care",
    slug: "elder-care",
    icon: "HeartPulse",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600",
    description: "In-home elderly assistance, companion care, mobility support, and medication management."
  },
  {
    name: "Health & Medical Care",
    slug: "health-medical",
    icon: "Stethoscope",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
    description: "Home nursing care, physiotherapist home visits, lab sample collection, and doctor calls."
  },
  {
    name: "Beauty & Grooming",
    slug: "beauty-grooming",
    icon: "Scissors",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600",
    description: "At-home salon services, haircuts, facial & waxing, bridal makeup, and men's grooming."
  },
  {
    name: "Wellness & Personal",
    slug: "wellness-personal",
    icon: "Heart",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
    description: "Swedish & deep tissue massage, yoga instruction, personal trainer, and diet counseling."
  },
  {
    name: "Photography & Events",
    slug: "photography-events",
    icon: "Camera",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600",
    description: "Event photography, portrait shoots, drone videography, and party DJ/sound system setup."
  },
  {
    name: "Catering & Chef Services",
    slug: "catering-chef",
    icon: "Utensils",
    imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600",
    description: "Private home chef, party food catering, live grill setup, and customized meal prep."
  },
  {
    name: "Education & Tutoring",
    slug: "education-tutoring",
    icon: "GraduationCap",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
    description: "K-12 subject home tutors, music lessons (guitar, piano), language tutors, and exam prep."
  },
  {
    name: "Pet Care & Grooming",
    slug: "pet-care",
    icon: "Dog",
    imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600",
    description: "Dog walking, doorstep pet grooming, pet sitting, and basic obedience training."
  },
  {
    name: "Laundry & Dry Cleaning",
    slug: "laundry-dry-cleaning",
    icon: "Shirt",
    imageUrl: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=600",
    description: "Doorstep wash & fold, steam ironing, dry cleaning, and heavy curtain/carpet cleaning."
  },
  {
    name: "Commercial Cleaning",
    slug: "commercial-cleaning",
    icon: "Building",
    imageUrl: "https://images.unsplash.com/photo-1613963931023-5dc59437c8a6?auto=format&fit=crop&q=80&w=600",
    description: "Office deep cleaning, retail store sanitization, glass facade washing, and carpet shampooing."
  },
  {
    name: "Delivery & Logistics",
    slug: "delivery-logistics",
    icon: "Package",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600",
    description: "Same-day courier dispatch, document pickup, errand runner, and bulky cargo transport."
  },
  {
    name: "Digital & Tech Services",
    slug: "digital-tech",
    icon: "Code",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600",
    description: "Website setup, Graphic design, Social media management, and local business SEO."
  }
];

async function seed() {
  try {
    console.log("🚀 Starting Category Schema & Data Migration...");

    // 1. Create Category table DDL if not existing
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Category" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "icon" TEXT,
        "imageUrl" TEXT,
        "description" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name");
      CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");
    `);
    console.log("✅ Category table ensured.");

    // 2. Insert/Upsert categories
    const categoryNameToIdMap = {};

    for (const cat of categoriesToSeed) {
      const id = "cat_" + cat.slug.replace(/-/g, "_");
      const res = await pool.query(`
        INSERT INTO "Category" ("id", "name", "slug", "icon", "imageUrl", "description", "isActive", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT ("name") DO UPDATE SET
          "slug" = EXCLUDED."slug",
          "icon" = EXCLUDED."icon",
          "imageUrl" = EXCLUDED."imageUrl",
          "description" = EXCLUDED."description",
          "updatedAt" = CURRENT_TIMESTAMP
        RETURNING "id", "name";
      `, [id, cat.name, cat.slug, cat.icon, cat.imageUrl, cat.description]);

      categoryNameToIdMap[cat.name] = res.rows[0].id;
    }
    console.log(`✅ Seeded ${categoriesToSeed.length} Categories.`);

    // 3. Ensure categoryId column on Service table
    await pool.query(`
      ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
    `);

    // Default category ID if matching fails
    const defaultCatId = categoryNameToIdMap["Home Maintenance & Handyman"] || Object.values(categoryNameToIdMap)[0];

    // Check if old "category" column exists on Service
    const checkCategoryCol = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'Service' AND column_name = 'category';
    `);

    if (checkCategoryCol.rows.length > 0) {
      // Migrate old string category to categoryId
      console.log("📦 Migrating existing Service string categories to Category foreign keys...");
      const services = await pool.query(`SELECT "id", "category" FROM "Service";`);

      for (const s of services.rows) {
        let catId = categoryNameToIdMap[s.category];
        if (!catId) {
          // Try case insensitive match or substring match
          const matchKey = Object.keys(categoryNameToIdMap).find(
            k => k.toLowerCase() === (s.category || "").toLowerCase()
          );
          catId = matchKey ? categoryNameToIdMap[matchKey] : defaultCatId;
        }

        await pool.query(`
          UPDATE "Service" SET "categoryId" = $1 WHERE "id" = $2;
        `, [catId, s.id]);
      }
      console.log("✅ Services successfully linked to Category IDs.");
    }

    // Set default categoryId for any unlinked service
    await pool.query(`
      UPDATE "Service" SET "categoryId" = $1 WHERE "categoryId" IS NULL;
    `, [defaultCatId]);

    // Make categoryId NOT NULL
    await pool.query(`
      ALTER TABLE "Service" ALTER COLUMN "categoryId" SET NOT NULL;
    `);

    // Add Foreign Key Constraint if not existing
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'Service_categoryId_fkey'
        ) THEN
          ALTER TABLE "Service" 
          ADD CONSTRAINT "Service_categoryId_fkey" 
          FOREIGN KEY ("categoryId") REFERENCES "Category"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
    `);

    console.log("✅ Foreign key constraint 'Service_categoryId_fkey' established.");
    console.log("🎉 Category Migration Completed Successfully!");
  } catch (err) {
    console.error("❌ Migration Error:", err);
  } finally {
    await pool.end();
  }
}

seed();
