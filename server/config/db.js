const prisma = require("./prisma");

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("✅ Connected to Neon PostgreSQL Database");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
