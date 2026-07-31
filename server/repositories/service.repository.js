const prisma = require("../config/prisma");

const defaultServiceSelect = {
    id: true,
    providerId: true,
    title: true,
    slug: true,
    description: true,
    category: true,
    location: true,
    price: true,
    priceType: true,
    rating: true,
    reviewCount: true,
    availability: true,
    badge: true,
    imageUrl: true,
    createdAt: true,
    provider: {
        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatar: true
        }
    }
};

/**
 * Repository layer for Service entity database operations.
 */
class ServiceRepository {
    async findById(id, select = defaultServiceSelect) {
        return await prisma.service.findUnique({
            where: { id },
            select
        });
    }

    async findBySlug(slug, select = defaultServiceSelect) {
        return await prisma.service.findUnique({
            where: { slug },
            select
        });
    }

    async findMany(where = {}, orderBy = { createdAt: "desc" }, select = defaultServiceSelect) {
        return await prisma.service.findMany({
            where,
            orderBy,
            select
        });
    }

    async create(data, select = defaultServiceSelect) {
        return await prisma.service.create({
            data,
            select
        });
    }

    async update(id, data, select = defaultServiceSelect) {
        return await prisma.service.update({
            where: { id },
            data,
            select
        });
    }

    async delete(id) {
        return await prisma.service.delete({
            where: { id }
        });
    }

    async count(where = {}) {
        return await prisma.service.count({ where });
    }
}

module.exports = new ServiceRepository();
