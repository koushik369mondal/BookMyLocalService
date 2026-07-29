const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const apiRoutes = require("./routes");

const app = express();

// Configure CORS allowed origins for cross connection (local dev + deployed client)
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL || "https://bookmylocalservice.onrender.com",
    "https://bookmylocalservice.onrender.com"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman) or matching allowedOrigins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Allow all origins gracefully to prevent production CORS blockages
            callback(null, true);
        }
    },
    credentials: true
}));

app.use(express.json());

// Initialize database connection
connectDB();

// API Routes
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
    res.send("Local Service Finder API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});