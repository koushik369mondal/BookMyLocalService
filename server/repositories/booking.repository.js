const prisma = require("../config/prisma");

const defaultBookingSelect = {
    id: true,
    customerId: true,
    providerId: true,
    serviceId: true,
    plan: true,
    date: true,
    time: true,
    price: true,
    platformFee: true,
    tax: true,
    discount: true,
    total: true,
    status: true,
    paymentStatus: true,
    paymentMethod: true,
    billingName: true,
    billingEmail: true,
    billingPhone: true,
    street: true,
    city: true,
    state: true,
    zipCode: true,
    createdAt: true,
    updatedAt: true,
    customer: {
        select: { id: true, fullName: true, email: true, phone: true, avatar: true }
    },
    provider: {
        select: { id: true, fullName: true, email: true, phone: true, avatar: true }
    },
    service: {
        select: { id: true, title: true, slug: true, category: true, imageUrl: true, price: true, priceType: true }
    }
};

/**
 * Repository layer for Booking entity database operations.
 */
class BookingRepository {
    async findById(id, select = defaultBookingSelect) {
        return await prisma.booking.findUnique({
            where: { id },
            select
        });
    }

    async findMany(where = {}, orderBy = { createdAt: "desc" }, select = defaultBookingSelect) {
        return await prisma.booking.findMany({
            where,
            orderBy,
            select
        });
    }

    async create(data, select = defaultBookingSelect) {
        return await prisma.booking.create({
            data,
            select
        });
    }

    async update(id, data, select = defaultBookingSelect) {
        return await prisma.booking.update({
            where: { id },
            data,
            select
        });
    }

    async delete(id) {
        return await prisma.booking.delete({
            where: { id }
        });
    }
}

module.exports = new BookingRepository();
