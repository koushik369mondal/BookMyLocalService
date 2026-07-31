const express = require("express");
const router = express.Router();
const customerController = require("./customer.controller");
const { protect } = require("../../middleware/authMiddleware");

router.use(protect);

router.get("/dashboard", customerController.getCustomerDashboard);
router.get("/profile", customerController.getCustomerProfile);

module.exports = router;
