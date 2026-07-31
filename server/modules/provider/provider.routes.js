const express = require("express");
const router = express.Router();
const providerController = require("./provider.controller");
const { protect, authorize } = require("../../middleware/authMiddleware");

router.use(protect);
router.use(authorize("PROVIDER", "ADMIN"));

router.get("/dashboard", providerController.getProviderDashboard);

module.exports = router;
