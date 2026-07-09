const bookingService = require("../../services/booking.service");

/**
 * Create a new pending booking
 */
const createBooking = async (req, res) => {
  try {
    const { serviceId, plan, date, time, price } = req.body;
    const customerId = req.user.id; // logged in user is customer

    if (!serviceId || !plan || !date || !time || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: serviceId, plan, date, time, price."
      });
    }

    const booking = await bookingService.createBooking({
      customerId,
      serviceId,
      plan,
      date,
      time,
      price
    });

    return res.status(201).json({
      success: true,
      message: "Booking initiated successfully.",
      data: booking
    });
  } catch (error) {
    console.error("Error in createBooking controller:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to initiate booking."
    });
  }
};

/**
 * Get bookings for the authenticated user (customer or provider context)
 */
const getBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role; // CUSTOMER, PROVIDER, ADMIN

    const bookings = await bookingService.getUserBookings(userId, role);

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error("Error in getBookings controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve bookings."
    });
  }
};

/**
 * Get booking by ID (requires customer/provider ownership or admin role)
 */
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    // Verify ownership
    if (
      req.user.role !== "ADMIN" &&
      booking.customerId !== req.user.id &&
      booking.providerId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this booking."
      });
    }

    return res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error("Error in getBookingById controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve booking."
    });
  }
};

/**
 * Update a booking
 */
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify booking exists and user has authorization
    const booking = await bookingService.getBookingById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    if (
      req.user.role !== "ADMIN" &&
      booking.customerId !== req.user.id &&
      booking.providerId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this booking."
      });
    }

    const updatedBooking = await bookingService.updateBooking(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully.",
      data: updatedBooking
    });
  } catch (error) {
    console.error("Error in updateBooking controller:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update booking."
    });
  }
};

/**
 * Delete a booking
 */
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify booking exists and user has authorization
    const booking = await bookingService.getBookingById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    if (req.user.role !== "ADMIN" && booking.customerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this booking."
      });
    }

    await bookingService.deleteBooking(id);

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully."
    });
  } catch (error) {
    console.error("Error in deleteBooking controller:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete booking."
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking
};
