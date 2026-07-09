const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} = require("../../controllers/booking/booking.controller");
const { protect } = require("../../middleware/authMiddleware");

// All booking routes are protected
router.use(protect);

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/user", getBookings); // Maps /user to retrieve user bookings
router.get("/:id", getBookingById);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;
