const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const apiRoutes = require("./routes");

const app = express();

<<<<<<< HEAD
=======
// Configure CORS allowed origins for cross connection (local dev + deployed client)
>>>>>>> f3ef3cedb233fd61c959c21877eac8d473dd3769
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
<<<<<<< HEAD
    "https://bookmylocalservice.onrender.com",
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
=======
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

>>>>>>> f3ef3cedb233fd61c959c21877eac8d473dd3769
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