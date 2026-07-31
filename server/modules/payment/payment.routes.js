const express = require("express");
const router = express.Router();
const { getCheckoutDetails, submitCheckout, processPayment } = require("./payment.controller");
const { protect } = require("../../middleware/authMiddleware");

router.get("/:bookingId", protect, getCheckoutDetails);
router.post("/submit", protect, submitCheckout);
router.post("/pay", protect, processPayment);

module.exports = router;
