const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const customerRoutes = require("../modules/customer/customer.routes");
const providerRoutes = require("../modules/provider/provider.routes");
const adminRoutes = require("../modules/admin/admin.routes");
const bookingRoutes = require("../modules/booking/booking.routes");
const paymentRoutes = require("../modules/payment/payment.routes");
const serviceRoutes = require("../modules/service/service.routes");
const contactRoutes = require("../modules/contact/contact.routes");
const dashboardRoutes = require("../modules/dashboard/dashboard.routes");
const profileRoutes = require("./profile.routes");
const healthRoutes = require("./health.routes");
const reviewRoutes = require("./review.routes");
const categoryRoutes = require("../modules/category/category.routes");

const { processPayment } = require("../modules/payment/payment.controller");
const { protect } = require("../middleware/authMiddleware");

// Feature Module Routers
router.use("/auth", authRoutes);
router.use("/customer", customerRoutes);
router.use("/provider", providerRoutes);
router.use("/admin", adminRoutes);
router.use("/bookings", bookingRoutes);
router.use("/checkout", paymentRoutes);
router.use("/payment", paymentRoutes);
router.use("/services", serviceRoutes);
router.use("/categories", categoryRoutes);
router.use("/contact", contactRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/profile", profileRoutes);
router.use("/health", healthRoutes);
router.use("/reviews", reviewRoutes);

// Direct Payment endpoint
router.post("/payment", protect, processPayment);

module.exports = router;
