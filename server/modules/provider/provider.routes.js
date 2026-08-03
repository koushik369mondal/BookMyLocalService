const express = require("express");
const router = express.Router();
const providerController = require("./provider.controller");
const { protect, authorize } = require("../../middleware/authMiddleware");
const upload = require("../../middleware/uploadMiddleware");

router.use(protect);
router.use(authorize("PROVIDER", "ADMIN"));

// Dashboard & Stats
router.get("/dashboard", providerController.getProviderDashboard);

// Services CRUD
router.get("/services", providerController.getProviderServices);
router.post("/services", upload.single("image"), providerController.createProviderService);
router.put("/services/:id", upload.single("image"), providerController.updateProviderService);
router.delete("/services/:id", providerController.deleteProviderService);

// Jobs / Assigned Bookings
router.get("/jobs", providerController.getProviderJobs);
router.put("/jobs/:id/status", providerController.updateJobStatus);

// Earnings & Transactions
router.get("/earnings", providerController.getProviderEarnings);

// Customer Reviews & Replies
router.get("/reviews", providerController.getProviderReviews);
router.post("/reviews/:id/reply", providerController.replyToReview);

// Availability Schedule & Blocked Dates
router.get("/availability", providerController.getProviderAvailability);
router.put("/availability", providerController.saveProviderAvailability);

module.exports = router;
