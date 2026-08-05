const prisma = require("../../config/prisma");

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
            where: { paymentStatus: "PAID" },
            _sum: { total: true }
        });
        return result._sum ? (result._sum.total || 0) : 0;
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
                isVerified: true,
                createdAt: true
            }
        });
    }

    async getRecentBookings(limit = 5) {
        return await prisma.booking.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            include: {
                customer: { select: { id: true, fullName: true, email: true, avatar: true, isVerified: true } },
                provider: { select: { id: true, fullName: true, email: true, avatar: true, isVerified: true } },
                service: {
                    select: {
                        id: true,
                        title: true,
                        imageUrl: true,
                        category: { select: { id: true, name: true, slug: true } }
                    }
                }
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
                        category: { select: { id: true, name: true, slug: true } }
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
            where: {
                providerId,
                OR: [
                    { bookingStatus: "COMPLETED" },
                    { status: "completed" }
                ]
            }
        });

        const pendingJobs = await prisma.booking.count({
            where: {
                providerId,
                OR: [
                    { bookingStatus: "PENDING" },
                    { status: "pending" }
                ]
            }
        });

        const earningsResult = await prisma.booking.aggregate({
            where: { providerId, paymentStatus: "PAID" },
            _sum: { total: true }
        });

        const services = await prisma.service.findMany({
            where: { providerId },
            include: {
                category: { select: { id: true, name: true, slug: true } }
            }
        });

        const recentBookings = await prisma.booking.findMany({
            where: { providerId },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                customer: { select: { id: true, fullName: true, email: true, phone: true, avatar: true, isVerified: true } },
                service: {
                    select: {
                        id: true,
                        title: true,
                        category: { select: { id: true, name: true, slug: true } }
                    }
                }
            }
        });

        return {
            totalJobs: totalJobs || 0,
            completedJobs: completedJobs || 0,
            pendingJobs: pendingJobs || 0,
            totalEarnings: earningsResult._sum ? (earningsResult._sum.total || 0) : 0,
            services: services || [],
            recentBookings: recentBookings || []
        };
    }

    // CUSTOMER DASHBOARD QUERIES
    async getCustomerStats(customerId) {
        const totalBookings = await prisma.booking.count({
            where: { customerId }
        });

        const completedBookings = await prisma.booking.count({
            where: {
                customerId,
                OR: [
                    { bookingStatus: "COMPLETED" },
                    { status: "completed" }
                ]
            }
        });

        const pendingBookings = await prisma.booking.count({
            where: {
                customerId,
                OR: [
                    { bookingStatus: "PENDING" },
                    { status: "pending" }
                ]
            }
        });

        const activeBookings = await prisma.booking.count({
            where: {
                customerId,
                OR: [
                    { bookingStatus: "CONFIRMED" },
                    { bookingStatus: "IN_PROGRESS" },
                    { status: "confirmed" },
                    { status: "upcoming" }
                ]
            }
        });

        const recentBookings = await prisma.booking.findMany({
            where: { customerId },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                provider: { select: { id: true, fullName: true, email: true, phone: true, avatar: true, isVerified: true } },
                service: {
                    select: {
                        id: true,
                        title: true,
                        imageUrl: true,
                        category: { select: { id: true, name: true, slug: true } }
                    }
                }
            }
        });

        return {
            totalBookings: totalBookings || 0,
            completedBookings: completedBookings || 0,
            pendingBookings: pendingBookings || 0,
            activeBookings: activeBookings || 0,
            recentBookings: recentBookings || []
        };
    }
}

module.exports = new DashboardRepository();
