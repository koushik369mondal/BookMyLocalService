const express = require("express");
const router = express.Router();
const providerController = require("./provider.controller");
const { protect, authorize } = require("../../middleware/authMiddleware");
const upload = require("../../middleware/uploadMiddleware");

router.use(protect);
router.use(authorize("PROVIDER", "ADMIN"));

router.get("/dashboard", providerController.getProviderDashboard);

// Provider Service CRUD endpoints (database-driven)
router.get("/services", providerController.getProviderServices);
router.post("/services", upload.single("image"), providerController.createProviderService);
router.put("/services/:id", upload.single("image"), providerController.updateProviderService);
router.delete("/services/:id", providerController.deleteProviderService);

module.exports = router;
