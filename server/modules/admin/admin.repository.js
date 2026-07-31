const prisma = require("../../config/prisma");

/**
 * Repository layer for Admin management database operations.
 */
class AdminRepository {
    async findAllUsers(where = {}, orderBy = { createdAt: "desc" }) {
        return await prisma.user.findMany({
            where,
            orderBy,
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                role: true,
                isVerified: true,
                avatar: true,
                address: true,
                city: true,
                state: true,
                zipCode: true,
                createdAt: true,
                _count: {
                    select: {
                        customerBookings: true,
                        providerBookings: true,
                        services: true
                    }
                }
            }
        });
    }

    async findAllProviders(where = {}, orderBy = { createdAt: "desc" }) {
        return await prisma.user.findMany({
            where: { role: "PROVIDER", ...where },
            orderBy,
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                role: true,
                isVerified: true,
                avatar: true,
                city: true,
                state: true,
                createdAt: true,
                services: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
                        rating: true,
                        price: true
                    }
                },
                _count: {
                    select: {
                        providerBookings: true
                    }
                }
            }
        });
    }

    async verifyUser(id, isVerified = true) {
        return await prisma.user.update({
            where: { id },
            data: { isVerified },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                isVerified: true
            }
        });
    }

    async deleteUser(id) {
        return await prisma.user.delete({
            where: { id }
        });
    }
}

module.exports = new AdminRepository();
