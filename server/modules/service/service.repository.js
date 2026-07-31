const prisma = require("../../config/prisma");

class ServiceRepository {
  async findAll(where = {}, orderBy = { createdAt: "desc" }) {
    return await prisma.service.findMany({
      where,
      orderBy,
      include: {
        provider: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatar: true,
            isVerified: true
          }
        }
      }
    });
  }

  async findById(id) {
    return await prisma.service.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatar: true,
            isVerified: true
          }
        }
      }
    });
  }

  async findBySlug(slug) {
    return await prisma.service.findUnique({
      where: { slug },
      include: {
        provider: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatar: true,
            isVerified: true
          }
        }
      }
    });
  }

  async create(serviceData) {
    return await prisma.service.create({
      data: serviceData,
      include: {
        provider: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true,
            isVerified: true
          }
        }
      }
    });
  }

  async update(id, updateData) {
    return await prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        provider: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatar: true,
            isVerified: true
          }
        }
      }
    });
  }

  async delete(id) {
    return await prisma.service.delete({
      where: { id }
    });
  }
}

module.exports = new ServiceRepository();
