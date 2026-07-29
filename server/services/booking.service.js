const bookingRepository = require("../repositories/booking.repository");
const serviceRepository = require("../repositories/service.repository");

/**
 * Create a new pending booking
 */
const createBooking = async (bookingData) => {
  const { customerId, serviceId, plan, date, time, price } = bookingData;

  const service = await serviceRepository.findById(serviceId);
  if (!service) {
    throw new Error("Service not found.");
  }

  const basePrice = parseFloat(price);
  const platformFee = 4.99;
  const tax = Math.round(basePrice * 0.085 * 100) / 100;
  const discount = 0.0;
  const total = Math.round((basePrice + platformFee + tax - discount) * 100) / 100;

  return await bookingRepository.create({
    customerId,
    serviceId,
    providerId: service.provider.id,
    plan,
    date,
    time,
    price: basePrice,
    platformFee,
    tax,
    discount,
    total,
    status: "pending",
    paymentStatus: "pending"
  });
};

/**
 * Get all bookings of a user (customer, provider, or admin)
 */
const getUserBookings = async (userId, role) => {
  const where = {};
  if (role === "CUSTOMER") where.customerId = userId;
  else if (role === "PROVIDER") where.providerId = userId;
  else if (role !== "ADMIN") {
    where.OR = [{ customerId: userId }, { providerId: userId }];
  }

  return await bookingRepository.findMany(where);
};

/**
 * Get booking by ID
 */
const getBookingById = async (id) => {
  return await bookingRepository.findById(id);
};

/**
 * Update booking details or status
 */
const updateBooking = async (id, updateData) => {
  const { status, paymentStatus, paymentMethod, billingName, billingEmail, billingPhone, street, city, state, zipCode, discount } = updateData;

  const data = {};
  if (status !== undefined) data.status = status;
  if (paymentStatus !== undefined) data.paymentStatus = paymentStatus;
  if (paymentMethod !== undefined) data.paymentMethod = paymentMethod;
  if (billingName !== undefined) data.billingName = billingName;
  if (billingEmail !== undefined) data.billingEmail = billingEmail;
  if (billingPhone !== undefined) data.billingPhone = billingPhone;
  if (street !== undefined) data.street = street;
  if (city !== undefined) data.city = city;
  if (state !== undefined) data.state = state;
  if (zipCode !== undefined) data.zipCode = zipCode;

  if (discount !== undefined) {
    data.discount = parseFloat(discount);
    const booking = await bookingRepository.findById(id);
    if (booking) {
      const basePrice = booking.price;
      const platformFee = booking.platformFee;
      const tax = booking.tax;
      data.total = Math.max(0, Math.round((basePrice + platformFee + tax - parseFloat(discount)) * 100) / 100);
    }
  }

  return await bookingRepository.update(id, data);
};

/**
 * Delete a booking
 */
const deleteBooking = async (id) => {
  return await bookingRepository.delete(id);
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  deleteBooking
};
