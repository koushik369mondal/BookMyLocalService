const prisma = require("../../config/prisma");

class ServiceRepository {
  async findAll(where = {}, orderBy = { createdAt: "desc" }) {
    return await prisma.service.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: { id: true, name: true, slug: true, icon: true, imageUrl: true }
        },
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
        category: {
          select: { id: true, name: true, slug: true, icon: true, imageUrl: true, description: true }
        },
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
        category: {
          select: { id: true, name: true, slug: true, icon: true, imageUrl: true, description: true }
        },
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
    const requiredFields = ["title", "slug", "description", "categoryId", "providerId", "location", "price", "priceType", "availability"];
    const missingFields = requiredFields.filter(field => serviceData[field] === undefined || serviceData[field] === null || serviceData[field] === "");

    if (serviceData.imageUrl === undefined || serviceData.imageUrl === null) {
      missingFields.push("imageUrl");
    }

    if (missingFields.length > 0) {
      console.error(`❌ [ServiceRepository.create] Missing required field(s): ${missingFields.join(", ")}`);
      throw new Error(`Missing required service field(s): ${missingFields.join(", ")}`);
    }

    try {
      return await prisma.service.create({
        data: serviceData,
        include: {
          category: {
            select: { id: true, name: true, slug: true, icon: true, imageUrl: true }
          },
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
    } catch (error) {
      console.error("❌ [ServiceRepository.create] Complete Prisma error details:", {
        code: error.code,
        meta: error.meta,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async update(id, updateData) {
    return await prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: { id: true, name: true, slug: true, icon: true, imageUrl: true }
        },
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
