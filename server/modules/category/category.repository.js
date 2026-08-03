const prisma = require("../../config/prisma");

class CategoryRepository {
  async findAll(where = {}) {
    return await prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { services: true }
        }
      }
    });
  }

  async findById(id) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        services: {
          select: {
            id: true,
            title: true,
            price: true,
            rating: true,
            imageUrl: true,
            location: true,
            provider: { select: { fullName: true } }
          }
        },
        _count: {
          select: { services: true }
        }
      }
    });
  }

  async findBySlug(slug) {
    return await prisma.category.findUnique({
      where: { slug },
      include: {
        services: {
          select: {
            id: true,
            title: true,
            price: true,
            rating: true,
            imageUrl: true,
            location: true,
            provider: { select: { fullName: true } }
          }
        },
        _count: {
          select: { services: true }
        }
      }
    });
  }

  async findByName(name) {
    return await prisma.category.findUnique({
      where: { name }
    });
  }

  async create(data) {
    return await prisma.category.create({
      data
    });
  }

  async update(id, data) {
    return await prisma.category.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return await prisma.category.delete({
      where: { id }
    });
  }

  async countServices(categoryId) {
    return await prisma.service.count({
      where: { categoryId }
    });
  }
}

module.exports = new CategoryRepository();
