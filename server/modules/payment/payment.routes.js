const express = require("express");
const router = express.Router();
const { getCheckoutDetails, submitCheckout, processPayment } = require("./payment.controller");
const { protect } = require("../../middleware/authMiddleware");

// GET /api/checkout/:bookingId
router.get("/:bookingId", protect, getCheckoutDetails);

// POST /api/checkout and POST /api/checkout/submit
router.post("/", protect, submitCheckout);
router.post("/submit", protect, submitCheckout);

// POST /api/checkout/pay
router.post("/pay", protect, processPayment);

module.exports = router;
