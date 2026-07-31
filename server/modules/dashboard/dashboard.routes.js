const express = require("express");
const router = express.Router();
const dashboardController = require("./dashboard.controller");
const { protect } = require("../../middleware/authMiddleware");

router.use(protect);

router.get("/admin", dashboardController.getAdminDashboard);
router.get("/provider", dashboardController.getProviderDashboard);
router.get("/customer", dashboardController.getCustomerDashboard);

module.exports = router;
