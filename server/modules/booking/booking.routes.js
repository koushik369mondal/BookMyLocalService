const express = require("express");
const router = express.Router();
const bookingController = require("./booking.controller");
const { protect } = require("../../middleware/authMiddleware");

router.use(protect);

router.post("/", bookingController.createBooking);
router.get("/", bookingController.getBookings);
router.get("/:id", bookingController.getBookingById);
router.put("/:id", bookingController.updateBooking);
router.patch("/:id/mark-paid", bookingController.markAsPaid);
router.put("/:id/mark-paid", bookingController.markAsPaid);
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
