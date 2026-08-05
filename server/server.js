const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const apiRoutes = require("./routes");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://bookmylocalservice-web.onrender.com",
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Initialize database connection
connectDB();

const { getHealthStatus } = require("./controllers/health.controller");

// API Routes
app.use("/api", apiRoutes);

app.get("/health", getHealthStatus);

app.get("/", (req, res) => {
    res.send("Local Service Finder API Running");
});

// Server entry point initialized with Prisma Client
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
// Fully Synchronized Prisma Client & Database Schema - v7