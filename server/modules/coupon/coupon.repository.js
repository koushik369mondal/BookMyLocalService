const prisma = require("../../config/prisma");

/**
 * Repository layer for Coupon management database operations.
 */
class CouponRepository {
    async create(data) {
        return await prisma.coupon.create({
            data
        });
    }

    async findById(id) {
        return await prisma.coupon.findUnique({
            where: { id }
        });
    }

    async findByCode(code) {
        if (!code) return null;
        return await prisma.coupon.findFirst({
            where: {
                code: {
                    equals: String(code).trim().toUpperCase(),
                    mode: "insensitive"
                }
            }
        });
    }

    async findAll(where = {}, orderBy = { createdAt: "desc" }) {
        return await prisma.coupon.findMany({
            where,
            orderBy
        });
    }

    async update(id, data) {
        return await prisma.coupon.update({
            where: { id },
            data
        });
    }

    async delete(id) {
        return await prisma.coupon.delete({
            where: { id }
        });
    }

    async incrementUsage(id) {
        return await prisma.coupon.update({
            where: { id },
            data: {
                usageCount: {
                    increment: 1
                }
            }
        });
    }
}

module.exports = new CouponRepository();
