const prisma = require("./prisma");

const connectDB = async () => {
    try {
        await prisma.$connect();
        let dbHost = "Unknown Host";
        let dbName = "";
        if (process.env.DATABASE_URL) {
            try {
                const parsedUrl = new URL(process.env.DATABASE_URL);
                dbHost = parsedUrl.host;
                dbName = parsedUrl.pathname;
            } catch (e) {
                dbHost = "PostgreSQL";
            }
        }
        console.log(`✅ Connected to Neon PostgreSQL Database at ${dbHost}${dbName}`);
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
