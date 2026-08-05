const adminRepository = require("./admin.repository");
const dashboardRepository = require("../dashboard/dashboard.repository");
const prisma = require("../../config/prisma");

/**
 * Service layer for Admin operations and business logic.
 */
class AdminService {
    /**
     * Get Admin Dashboard Overview metrics.
     */
    async getDashboardData() {
        const totalUsers = await dashboardRepository.countTotalUsers();
        const totalProviders = await dashboardRepository.countTotalProviders();
        const totalBookings = await dashboardRepository.countTotalBookings();
        const totalRevenue = await dashboardRepository.aggregateTotalRevenue();

        const recentUsers = await dashboardRepository.getRecentUsers(5);
        const recentBookings = await dashboardRepository.getRecentBookings(5);
        const unverifiedProviders = await dashboardRepository.getUnverifiedProviders();

        return {
            stats: {
                totalUsers,
                totalProviders,
                totalBookings,
                totalRevenue: Math.round(totalRevenue * 100) / 100
            },
            recentUsers,
            recentBookings,
            unverifiedProviders
        };
    }

    /**
     * Get detailed analytics for revenue, bookings, and user growth.
     */
    async getAnalyticsData() {
        const totalUsers = await prisma.user.count();
        const totalProviders = await prisma.user.count({ where: { role: "PROVIDER" } });
        const totalCustomers = await prisma.user.count({ where: { role: "CUSTOMER" } });
        const totalBookings = await prisma.booking.count();
        const completedBookings = await prisma.booking.count({
            where: {
                OR: [
                    { bookingStatus: "COMPLETED" },
                    { status: "completed" }
                ]
            }
        });
        const pendingBookings = await prisma.booking.count({
            where: {
                OR: [
                    { bookingStatus: "PENDING" },
                    { status: "pending" }
                ]
            }
        });
        const cancelledBookings = await prisma.booking.count({
            where: {
                OR: [
                    { bookingStatus: "CANCELLED" },
                    { status: "cancelled" }
                ]
            }
        });

        const revenueResult = await prisma.booking.aggregate({
            where: { paymentStatus: "PAID" },
            _sum: { total: true }
        });

        return {
            usersOverview: { totalUsers, totalProviders, totalCustomers },
            bookingsOverview: { totalBookings, completedBookings, pendingBookings, cancelledBookings },
            financials: { totalRevenue: revenueResult._sum ? (revenueResult._sum.total || 0) : 0 }
        };
    }

    /**
     * Get all registered users with role and search filters.
     */
    async getAllUsers(filters = {}) {
        const { role, search } = filters;
        const where = {};

        if (role && role !== "all") {
            where.role = role.toUpperCase();
        }

        if (search && search.trim() !== "") {
            const q = search.trim();
            where.OR = [
                { fullName: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { phone: { contains: q, mode: "insensitive" } }
            ];
        }

        return await adminRepository.findAllUsers(where);
    }

    /**
     * Get all providers with search filtering.
     */
    async getAllProviders(filters = {}) {
        const { search } = filters;
        const where = {};

        if (search && search.trim() !== "") {
            const q = search.trim();
            where.OR = [
                { fullName: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } }
            ];
        }

        return await adminRepository.findAllProviders(where);
    }

    /**
     * Verify or update provider verification status.
     */
    async verifyProvider(id, isVerified = true) {
        return await adminRepository.verifyUser(id, isVerified);
    }

    /**
     * Delete a user account.
     */
    async deleteUser(id) {
        return await adminRepository.deleteUser(id);
    }

    /**
     * Admin view of all services listed on the platform.
     */
    async getAllServices(filters = {}) {
        const { category, search } = filters;
        const where = {};

        if (category && category !== "all") {
            where.category = { is: { name: { equals: category, mode: "insensitive" } } };
        }

        if (search && search.trim() !== "") {
            const q = search.trim();
            where.OR = [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } }
            ];
        }

        return await prisma.service.findMany({
            where,
            include: {
                provider: {
                    select: { id: true, fullName: true, email: true, isVerified: true }
                },
                category: { select: { id: true, name: true, slug: true } }
            },
            orderBy: { createdAt: "desc" }
        });
    }

    /**
     * Admin view of all bookings on the platform.
     */
    async getAllBookings(filters = {}) {
        const { status, paymentStatus } = filters;
        const where = {};

        if (status && status !== "all") {
            const upStatus = status.toUpperCase();
            where.OR = [
                { bookingStatus: upStatus },
                { status: status }
            ];
        }

        if (paymentStatus && paymentStatus !== "all") {
            where.paymentStatus = paymentStatus.toUpperCase();
        }

        return await prisma.booking.findMany({
            where,
            include: {
                customer: { select: { id: true, fullName: true, email: true } },
                provider: { select: { id: true, fullName: true, email: true } },
                service: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        category: { select: { id: true, name: true, slug: true } }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }

    /**
     * Admin view of all payments/transactions on the platform.
     */
    async getAllPayments() {
        return await prisma.booking.findMany({
            where: {
                paymentStatus: { in: ["PAID", "PENDING", "REFUNDED"] }
            },
            select: {
                id: true,
                total: true,
                paymentMethod: true,
                paymentStatus: true,
                createdAt: true,
                updatedAt: true,
                customer: { select: { id: true, fullName: true, email: true } },
                provider: { select: { id: true, fullName: true, email: true } },
                service: { select: { id: true, title: true } }
            },
            orderBy: { createdAt: "desc" }
        });
    }
}

module.exports = new AdminService();
