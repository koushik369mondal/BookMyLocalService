const prisma = require("../../config/prisma");

class BookingRepository {
  async create(bookingData) {
    return await prisma.booking.create({
      data: bookingData,
      include: {
        customer: { select: { id: true, fullName: true, email: true, phone: true } },
        provider: { select: { id: true, fullName: true, email: true, phone: true } },
        service: { select: { id: true, title: true, price: true, category: true, imageUrl: true } }
      }
    });
  }

  async findById(id) {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, fullName: true, email: true, phone: true, avatar: true } },
        provider: { select: { id: true, fullName: true, email: true, phone: true, avatar: true } },
        service: { select: { id: true, title: true, price: true, priceType: true, category: true, imageUrl: true, description: true } }
      }
    });
  }

  async findByUserId(userId, role) {
    const where = {};
    if (role === "PROVIDER") {
      where.providerId = userId;
    } else if (role === "CUSTOMER") {
      where.customerId = userId;
    } else if (role === "ADMIN") {
      // Admin gets all bookings
    } else {
      where.OR = [
        { customerId: userId },
        { providerId: userId }
      ];
    }

    return await prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { id: true, fullName: true, email: true, avatar: true } },
        provider: { select: { id: true, fullName: true, email: true, avatar: true } },
        service: { select: { id: true, title: true, category: true, price: true, imageUrl: true } }
      }
    });
  }

  async update(id, updateData) {
    return await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        customer: { select: { id: true, fullName: true, email: true } },
        provider: { select: { id: true, fullName: true, email: true } },
        service: { select: { id: true, title: true, price: true } }
      }
    });
  }

  async delete(id) {
    return await prisma.booking.delete({
      where: { id }
    });
  }
}

module.exports = new BookingRepository();
