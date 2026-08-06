require("dotenv").config();
const prisma = require("../config/prisma");
const { ADMIN_EMAILS } = require("../constants/auth.constants");

async function seedAdminUsers() {
    console.log("[SEED ADMIN] Seeding admin accounts...");

    for (const email of ADMIN_EMAILS) {
        const cleanEmail = email.toLowerCase().trim();
        const existingUser = await prisma.user.findUnique({
            where: { email: cleanEmail }
        });

        if (existingUser) {
            if (existingUser.role !== "ADMIN") {
                const updated = await prisma.user.update({
                    where: { email: cleanEmail },
                    data: { role: "ADMIN", isVerified: true }
                });
                console.log(`[SEED ADMIN] Updated '${cleanEmail}' to ADMIN role (ID: ${updated.id})`);
            } else {
                console.log(`[SEED ADMIN] '${cleanEmail}' is already an ADMIN (ID: ${existingUser.id})`);
            }
        } else {
            const newUser = await prisma.user.create({
                data: {
                    fullName: "BookMyLocalService Admin",
                    email: cleanEmail,
                    role: "ADMIN",
                    isVerified: true
                }
            });
            console.log(`[SEED ADMIN] Created new ADMIN user for '${cleanEmail}' (ID: ${newUser.id})`);
        }
    }
}

seedAdminUsers()
    .catch((err) => {
        console.error("[SEED ADMIN ERROR]:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
