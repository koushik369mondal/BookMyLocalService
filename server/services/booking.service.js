const prisma = require("../config/prisma");

/**
 * Create a new pending booking
 */
const createBooking = async (bookingData) => {
  const { customerId, serviceId, plan, date, time, price } = bookingData;

  // Verify service exists and get its providerId
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  });

  if (!service) {
    throw new Error("Service not found.");
  }

  // Calculate pricing breakdown
  const basePrice = parseFloat(price);
  const platformFee = 4.99;
  const tax = Math.round(basePrice * 0.085 * 100) / 100; // 8.5%
  const discount = 0.0; // Initially no discount
  const total = Math.round((basePrice + platformFee + tax - discount) * 100) / 100;

  return await prisma.booking.create({
    data: {
      customerId,
      serviceId,
      providerId: service.providerId,
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
    },
    include: {
      customer: {
        select: { id: true, fullName: true, email: true, phone: true, avatar: true }
      },
      provider: {
        select: { id: true, fullName: true, email: true, phone: true, avatar: true }
      },
      service: {
        select: { id: true, title: true, imageUrl: true, category: true }
      }
    }
  });
};

/**
 * Get all bookings of a user (either customer, provider, or all if admin)
 */
const getUserBookings = async (userId, role) => {
  let where = {};
  
  if (role === "CUSTOMER") {
    where.customerId = userId;
  } else if (role === "PROVIDER") {
    where.providerId = userId;
  } else if (role !== "ADMIN") {
    // Fallback for user role check
    where.OR = [
      { customerId: userId },
      { providerId: userId }
    ];
  }

  return await prisma.booking.findMany({
    where,
    include: {
      customer: {
        select: { id: true, fullName: true, email: true, phone: true, avatar: true, address: true, city: true, state: true, zipCode: true }
      },
      provider: {
        select: { id: true, fullName: true, email: true, phone: true, avatar: true }
      },
      service: {
        select: { id: true, title: true, imageUrl: true, category: true, description: true }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

/**
 * Get booking by ID
 */
const getBookingById = async (id) => {
  return await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: {
        select: { id: true, fullName: true, email: true, phone: true, avatar: true, address: true, city: true, state: true, zipCode: true }
      },
      provider: {
        select: { id: true, fullName: true, email: true, phone: true, avatar: true }
      },
      service: {
        select: { id: true, title: true, imageUrl: true, category: true, description: true }
      }
    }
  });
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
    // Recalculate total
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (booking) {
      const basePrice = booking.price;
      const platformFee = booking.platformFee;
      const tax = booking.tax;
      data.total = Math.max(0, Math.round((basePrice + platformFee + tax - parseFloat(discount)) * 100) / 100);
    }
  }

  return await prisma.booking.update({
    where: { id },
    data,
    include: {
      customer: {
        select: { id: true, fullName: true, email: true, phone: true, avatar: true }
      },
      provider: {
        select: { id: true, fullName: true, email: true, phone: true, avatar: true }
      },
      service: {
        select: { id: true, title: true, imageUrl: true, category: true }
      }
    }
  });
};

/**
 * Delete a booking
 */
const deleteBooking = async (id) => {
  return await prisma.booking.delete({
    where: { id }
  });
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  deleteBooking
};
