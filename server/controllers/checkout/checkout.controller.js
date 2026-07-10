const bookingService = require("../../services/booking.service");

/**
 * Fetch checkout details for a booking
 */
const getCheckoutDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await bookingService.getBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    // Verify ownership
    if (req.user.role !== "ADMIN" && booking.customerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access checkout for this booking."
      });
    }

    return res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error("Error in getCheckoutDetails controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve checkout details."
    });
  }
};

/**
 * Submit checkout (save billing and payment method info)
 */
const submitCheckout = async (req, res) => {
  try {
    const { bookingId, fullName, email, phone, street, city, state, zipCode, paymentMethod, discount } = req.body;

    if (!bookingId || !fullName || !email || !phone || !street || !city || !state || !zipCode || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required checkout fields."
      });
    }

    if (!/^\d{6}$/.test(zipCode)) {
      return res.status(400).json({
        success: false,
        message: "PIN code must be 6 digits"
      });
    }

    const booking = await bookingService.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    if (req.user.role !== "ADMIN" && booking.customerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this booking."
      });
    }

    const updateData = {
      billingName: fullName,
      billingEmail: email,
      billingPhone: phone,
      street,
      city,
      state,
      zipCode,
      paymentMethod
    };

    if (discount !== undefined) {
      updateData.discount = parseFloat(discount);
    }

    const updatedBooking = await bookingService.updateBooking(bookingId, updateData);

    return res.status(200).json({
      success: true,
      message: "Checkout details updated.",
      data: updatedBooking
    });
  } catch (error) {
    console.error("Error in submitCheckout controller:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to submit checkout."
    });
  }
};

/**
 * Complete payment authorization
 */
const processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, cardNumber } = req.body;

    if (!bookingId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "bookingId and paymentMethod are required."
      });
    }

    const booking = await bookingService.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    if (req.user.role !== "ADMIN" && booking.customerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to pay for this booking."
      });
    }

    // Simulated decline rules:
    // 1. If billingName contains "error"
    // 2. If card number ends with/contains "0000"
    const isDeclineName = booking.billingName && booking.billingName.toLowerCase().includes("error");
    const isDeclineCard = paymentMethod === "card" && cardNumber && cardNumber.replace(/\s+/g, "").includes("0000");

    if (isDeclineName || isDeclineCard) {
      return res.status(400).json({
        success: false,
        message: "Transaction declined. Please verify your payment credentials and try again."
      });
    }

    // Determine status values
    const status = "upcoming"; // paid/cash bookings move to upcoming status
    const paymentStatus = paymentMethod === "cash" ? "pending" : "paid";

    const updatedBooking = await bookingService.updateBooking(bookingId, {
      status,
      paymentStatus,
      paymentMethod
    });

    return res.status(200).json({
      success: true,
      message: "Payment processed successfully.",
      data: updatedBooking
    });
  } catch (error) {
    console.error("Error in processPayment controller:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to process payment."
    });
  }
};

module.exports = {
  getCheckoutDetails,
  submitCheckout,
  processPayment
};
