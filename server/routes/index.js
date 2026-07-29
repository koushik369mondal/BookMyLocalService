const express = require("express");
const router = express.Router();
const authRoutes = require("./auth/auth.routes");
const profileRoutes = require("./profile.routes");
const serviceRoutes = require("./service/service.routes");
const bookingRoutes = require("./booking/booking.routes");
const checkoutRoutes = require("./checkout/checkout.routes");
const contactRoutes = require("./contact/contact.routes");
const dashboardRoutes = require("./dashboard.routes");
const adminRoutes = require("./admin.routes");
const { processPayment } = require("../controllers/checkout/checkout.controller");
const { protect } = require("../middleware/authMiddleware");

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/services", serviceRoutes);
router.use("/bookings", bookingRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/contact", contactRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/admin", adminRoutes);
router.post("/payment", protect, processPayment);

module.exports = router;
