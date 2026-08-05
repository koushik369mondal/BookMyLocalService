const serviceRepository = require("./service.repository");
const prisma = require("../../config/prisma");
const cloudinary = require("../../config/cloudinary");

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const extractCloudinaryPublicId = (url) => {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    const pathAfterUpload = parts[1].replace(/^v\d+\//, "");
    const publicIdWithExt = pathAfterUpload.split(".")[0];
    return publicIdWithExt || null;
  } catch (e) {
    return null;
  }
};

const formatServiceResponse = (service) => {
  if (!service) return service;
  if (Array.isArray(service)) {
    return service.map(formatServiceResponse);
  }
  if (service.provider) {
    service.provider.profileImage = service.provider.avatar || service.provider.profileImage || null;
  }
  return service;
};

class ServiceService {
  async getAllServices(filters = {}) {
    const { category, categoryId, search, location, minPrice, maxPrice, rating, availability, sortBy } = filters;
    const where = {};

    const catParam = categoryId || category;
    if (catParam && catParam !== "all") {
      where.category = {
        OR: [
          { id: catParam },
          { slug: catParam },
          { name: { equals: catParam, mode: "insensitive" } }
        ]
      };
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
        { category: { name: { contains: q, mode: "insensitive" } } }
      ];
    }

    if (location && location.trim() !== "") {
      where.location = { contains: location.trim(), mode: "insensitive" };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating) };
    }

    if (availability && availability !== "all") {
      where.availability = { equals: availability, mode: "insensitive" };
    }

    let orderBy = { createdAt: "desc" };
    if (sortBy === "price_asc") orderBy = { price: "asc" };
    if (sortBy === "price_desc") orderBy = { price: "desc" };
    if (sortBy === "rating_desc") orderBy = { rating: "desc" };
    if (sortBy === "popular") orderBy = { reviewCount: "desc" };

    const services = await serviceRepository.findAll(where, orderBy);
    return formatServiceResponse(services);
  }

  async getServiceById(id) {
    const service = await serviceRepository.findById(id);
    return formatServiceResponse(service);
  }

  async getServiceBySlug(slug) {
    const service = await serviceRepository.findBySlug(slug);
    return formatServiceResponse(service);
  }

  async resolveCategoryId(categoryInput) {
    if (categoryInput) {
      let category = await prisma.category.findUnique({ where: { id: categoryInput } });
      if (!category) {
        category = await prisma.category.findUnique({ where: { slug: categoryInput } });
      }
      if (!category) {
        category = await prisma.category.findFirst({
          where: { name: { equals: categoryInput, mode: "insensitive" } }
        });
      }
      if (category) return category.id;
    }

    // Fallback: Return first active category ID from database
    const fallbackCategory = await prisma.category.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "asc" }
    });
    return fallbackCategory ? fallbackCategory.id : null;
  }

  async createService(data, file) {
    if (!data.title || !data.title.trim()) throw new Error("Service title is required.");
    if (!data.description || !data.description.trim()) throw new Error("Service description is required.");
    if (!data.location || !data.location.trim()) throw new Error("Service location is required.");
    if (data.price === undefined || data.price === null || isNaN(parseFloat(data.price))) throw new Error("Valid service price is required.");
    if (!data.providerId) throw new Error("Provider ID is required.");

    let imageUrl = data.imageUrl ? data.imageUrl.trim() : "";

    if (file) {
      const base64File = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.uploader.upload(base64File, {
        folder: "services",
        resource_type: "auto",
        transformation: [
          { width: 1200, height: 800, crop: "limit", quality: "auto", fetch_format: "auto" }
        ]
      });
      imageUrl = uploadResponse.secure_url;
    }

    let baseSlug = generateSlug(data.title);
    if (!baseSlug) baseSlug = `service-${Date.now()}`;
    let slug = data.slug ? generateSlug(data.slug) : baseSlug;
    let counter = 1;
    let checkSlug = slug;
    while (await serviceRepository.findBySlug(checkSlug)) {
      checkSlug = `${slug}-${counter}`;
      counter++;
    }
    slug = checkSlug;

    const categoryId = await this.resolveCategoryId(data.categoryId || data.category);
    if (!categoryId) {
      throw new Error("Invalid or missing service category ID.");
    }

    const serviceData = {
      title: data.title.trim(),
      slug,
      description: data.description.trim(),
      categoryId,
      providerId: data.providerId,
      location: data.location.trim(),
      price: parseFloat(data.price),
      priceType: data.priceType || "/hr",
      availability: data.availability || "available",
      badge: data.badge ? data.badge.trim() : null,
      imageUrl
    };

    return await serviceRepository.create(serviceData);
  }

  async updateService(id, data, file) {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw new Error("Service not found.");
    }

    const updateData = {};
    if (data.title) {
      updateData.title = data.title.trim();
      let baseSlug = generateSlug(data.title);
      let slug = baseSlug;
      let counter = 1;
      let existing = await serviceRepository.findBySlug(slug);
      while (existing && existing.id !== id) {
        slug = `${baseSlug}-${counter}`;
        counter++;
        existing = await serviceRepository.findBySlug(slug);
      }
      updateData.slug = slug;
    }

    if (data.description) updateData.description = data.description.trim();

    if (data.categoryId || data.category) {
      const categoryId = await this.resolveCategoryId(data.categoryId || data.category);
      if (categoryId) updateData.categoryId = categoryId;
    }

    if (data.location) updateData.location = data.location.trim();
    if (data.price) updateData.price = parseFloat(data.price);
    if (data.priceType) updateData.priceType = data.priceType;
    if (data.availability) updateData.availability = data.availability;
    if (data.badge !== undefined) updateData.badge = data.badge ? data.badge.trim() : null;
    if (data.imageUrl) updateData.imageUrl = data.imageUrl;

    if (file) {
      if (service.imageUrl) {
        const oldPublicId = extractCloudinaryPublicId(service.imageUrl);
        if (oldPublicId) {
          try {
            await cloudinary.uploader.destroy(oldPublicId);
            console.log(`🗑️ Destroyed replaced Cloudinary image: ${oldPublicId}`);
          } catch (e) {
            console.warn("Failed to destroy old Cloudinary image:", e.message);
          }
        }
      }

      const base64File = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.uploader.upload(base64File, {
        folder: "services",
        resource_type: "auto",
        transformation: [
          { width: 1200, height: 800, crop: "limit", quality: "auto", fetch_format: "auto" }
        ]
      });
      updateData.imageUrl = uploadResponse.secure_url;
    }

    return await serviceRepository.update(id, updateData);
  }

  async deleteService(id) {
    const service = await serviceRepository.findById(id);
    if (service && service.imageUrl) {
      const publicId = extractCloudinaryPublicId(service.imageUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`🗑️ Destroyed deleted service Cloudinary image: ${publicId}`);
        } catch (e) {
          console.warn(`Failed to destroy Cloudinary image ${publicId}:`, e.message);
        }
      }
    }
    return await serviceRepository.delete(id);
  }

  async getServiceCategories() {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        _count: { select: { services: true } }
      }
    });

    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "Briefcase",
      image: cat.imageUrl || "",
      description: cat.description || "",
      count: cat._count?.services || 0
    }));
  }
}

module.exports = new ServiceService();
