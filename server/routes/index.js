const express = require("express");
const router = express.Router();
const authRoutes = require("./auth/auth.routes");
const profileRoutes = require("./profile.routes");
const serviceRoutes = require("./service/service.routes");

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/services", serviceRoutes);

module.exports = router;
