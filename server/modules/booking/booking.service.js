const bookingRepository = require("./booking.repository");
const prisma = require("../../config/prisma");

class BookingService {
  async createBooking({ customerId, serviceId, plan, date, time, price }) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      throw new Error("Target service not found.");
    }

    let numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      numericPrice = service.price;
    }

    const calculatedTotal = numericPrice * 1.05; // 5% platform fee

    return await bookingRepository.create({
      customerId,
      providerId: service.providerId,
      serviceId,
      plan,
      date,
      time,
      price: numericPrice,
      total: Math.round(calculatedTotal * 100) / 100,
      status: "pending",
      paymentStatus: "pending"
    });
  }

  async getBookingById(id) {
    return await bookingRepository.findById(id);
  }

  async getUserBookings(userId, role) {
    return await bookingRepository.findByUserId(userId, role);
  }

  async updateBooking(id, updateData) {
    return await bookingRepository.update(id, updateData);
  }

  async deleteBooking(id) {
    return await bookingRepository.delete(id);
  }
}

module.exports = new BookingService();
