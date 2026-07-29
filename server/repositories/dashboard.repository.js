const prisma = require("../config/prisma");

/**
 * Repository layer for Dashboard & Analytics database operations.
 */
class DashboardRepository {
    // ADMIN DASHBOARD QUERIES
    async countTotalUsers() {
        return await prisma.user.count({
            where: { role: "CUSTOMER" }
        });
    }

    async countTotalProviders() {
        return await prisma.user.count({
            where: { role: "PROVIDER" }
        });
    }

    async countTotalBookings() {
        return await prisma.booking.count();
    }

    async aggregateTotalRevenue() {
        const result = await prisma.booking.aggregate({
            where: { paymentStatus: "paid" },
            _sum: { total: true }
        });
        return result._sum.total || 0;
    }

    async getRecentUsers(limit = 5) {
        return await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                avatar: true,
                createdAt: true
            }
        });
    }

    async getRecentBookings(limit = 5) {
        return await prisma.booking.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            include: {
                customer: { select: { id: true, fullName: true, email: true, avatar: true } },
                provider: { select: { id: true, fullName: true, email: true } },
                service: { select: { id: true, title: true, category: true } }
            }
        });
    }

    async getUnverifiedProviders() {
        return await prisma.user.findMany({
            where: {
                role: "PROVIDER",
                isVerified: false
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                city: true,
                state: true,
                createdAt: true,
                services: {
                    select: {
                        id: true,
                        title: true,
                        category: true
                    }
                }
            }
        });
    }

    // PROVIDER DASHBOARD QUERIES
    async getProviderStats(providerId) {
        const totalJobs = await prisma.booking.count({
            where: { providerId }
        });

        const completedJobs = await prisma.booking.count({
            where: { providerId, status: "completed" }
        });

        const pendingJobs = await prisma.booking.count({
            where: { providerId, status: "pending" }
        });

        const earningsResult = await prisma.booking.aggregate({
            where: { providerId, paymentStatus: "paid" },
            _sum: { total: true }
        });

        const services = await prisma.service.findMany({
            where: { providerId },
            select: {
                id: true,
                title: true,
                category: true,
                price: true,
                priceType: true,
                rating: true,
                reviewCount: true,
                availability: true,
                imageUrl: true
            }
        });

        const recentBookings = await prisma.booking.findMany({
            where: { providerId },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                customer: { select: { id: true, fullName: true, email: true, phone: true, avatar: true } },
                service: { select: { id: true, title: true, category: true } }
            }
        });

        return {
            totalJobs,
            completedJobs,
            pendingJobs,
            totalEarnings: earningsResult._sum.total || 0,
            services,
            recentBookings
        };
    }

    // CUSTOMER DASHBOARD QUERIES
    async getCustomerStats(customerId) {
        const totalBookings = await prisma.booking.count({
            where: { customerId }
        });

        const completedBookings = await prisma.booking.count({
            where: { customerId, status: "completed" }
        });

        const pendingBookings = await prisma.booking.count({
            where: { customerId, status: "pending" }
        });

        const activeBookings = await prisma.booking.count({
            where: { customerId, status: "confirmed" }
        });

        const recentBookings = await prisma.booking.findMany({
            where: { customerId },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                provider: { select: { id: true, fullName: true, email: true, phone: true, avatar: true } },
                service: { select: { id: true, title: true, category: true, imageUrl: true } }
            }
        });

        return {
            totalBookings,
            completedBookings,
            pendingBookings,
            activeBookings,
            recentBookings
        };
    }
}

module.exports = new DashboardRepository();
