const express = require("express");
const router = express.Router();
const {
  getCheckoutDetails,
  submitCheckout
} = require("../../controllers/checkout/checkout.controller");
const { protect } = require("../../middleware/authMiddleware");

router.get("/:bookingId", protect, getCheckoutDetails);
router.post("/", protect, submitCheckout);

module.exports = router;
