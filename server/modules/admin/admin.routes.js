const express = require("express");
const router = express.Router();
const adminController = require("./admin.controller");
const adminMiddleware = require("../../middleware/adminMiddleware");

// Protect all admin endpoints with both authentication and role-based authorization (ADMIN)
router.use(adminMiddleware);

// Dashboard & Analytics
router.get("/dashboard", adminController.getDashboard);
router.get("/analytics", adminController.getAnalytics);

// User Management
router.get("/users", adminController.getUsers);
router.delete("/users/:id", adminController.deleteUser);

// Provider Management
router.get("/providers", adminController.getProviders);
router.put("/verify-provider/:id", adminController.verifyProvider);
router.put("/providers/:id/verify", adminController.verifyProvider);

// Service Management
router.get("/services", adminController.getServices);

// Booking Management
router.get("/bookings", adminController.getBookings);

// Payment & Revenue Analytics Management
router.get("/payments", adminController.getPayments);

module.exports = router;
