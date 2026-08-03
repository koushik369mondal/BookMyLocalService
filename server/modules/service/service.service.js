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

class ServiceService {
  async getAllServices(filters = {}) {
    const { category, search, location, minPrice, maxPrice, rating, availability, sortBy } = filters;
    const where = {};

    if (category && category !== "all") {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } }
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

    return await serviceRepository.findAll(where, orderBy);
  }

  async getServiceById(id) {
    return await serviceRepository.findById(id);
  }

  async getServiceBySlug(slug) {
    return await serviceRepository.findBySlug(slug);
  }

  async createService(data, file) {
    let imageUrl = data.imageUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600";

    if (file) {
      const base64File = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.uploader.upload(base64File, {
        folder: "services",
        resource_type: "auto"
      });
      imageUrl = uploadResponse.secure_url;
    }

    let baseSlug = generateSlug(data.title);
    let slug = baseSlug;
    let counter = 1;
    while (await serviceRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return await serviceRepository.create({
      title: data.title.trim(),
      slug,
      description: data.description.trim(),
      category: data.category.trim(),
      providerId: data.providerId,
      location: data.location.trim(),
      price: parseFloat(data.price),
      priceType: data.priceType || "fixed",
      availability: data.availability || "available",
      badge: data.badge ? data.badge.trim() : null,
      imageUrl
    });
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
    if (data.category) updateData.category = data.category.trim();
    if (data.location) updateData.location = data.location.trim();
    if (data.price) updateData.price = parseFloat(data.price);
    if (data.priceType) updateData.priceType = data.priceType;
    if (data.availability) updateData.availability = data.availability;
    if (data.badge !== undefined) updateData.badge = data.badge ? data.badge.trim() : null;
    if (data.imageUrl) updateData.imageUrl = data.imageUrl;

    if (file) {
      const base64File = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.uploader.upload(base64File, {
        folder: "services",
        resource_type: "auto"
      });
      updateData.imageUrl = uploadResponse.secure_url;
    }

    return await serviceRepository.update(id, updateData);
  }

  async deleteService(id) {
    return await serviceRepository.delete(id);
  }

  async getServiceCategories() {
    const services = await prisma.service.findMany({
      select: { category: true, imageUrl: true }
    });

    const categoryMap = {};
    services.forEach(s => {
      if (!categoryMap[s.category]) {
        categoryMap[s.category] = {
          name: s.category,
          count: 0,
          image: s.imageUrl
        };
      }
      categoryMap[s.category].count += 1;
    });

    return Object.values(categoryMap);
  }
}

module.exports = new ServiceService();
