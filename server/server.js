// Trigger restart to load regenerated Prisma client
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const apiRoutes = require("./routes");

const app = express();

app.use(cors());
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