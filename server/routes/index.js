const express = require("express");
const router = express.Router();
const authRoutes = require("./auth/auth.routes");
const profileRoutes = require("./profile.routes");

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);

module.exports = router;
