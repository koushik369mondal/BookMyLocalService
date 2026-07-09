const prisma = require("../config/prisma");
const cloudinary = require("../config/cloudinary");

/**
 * Slugify a string helper
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

/**
 * Generate a unique slug
 */
const generateUniqueSlug = async (title) => {
  let slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const existing = await prisma.service.findUnique({
      where: { slug: uniqueSlug }
    });
    if (!existing) {
      break;
    }
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

/**
 * Upload image to Cloudinary helper
 */
const uploadToCloudinary = async (file) => {
  if (!file) return null;

  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error("Invalid file type. Only JPG, JPEG, PNG, and WebP are allowed.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size exceeds 5MB limit.");
  }

  const base64File = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const uploadResponse = await cloudinary.uploader.upload(base64File, {
    folder: "services",
    resource_type: "auto"
  });

  return uploadResponse.secure_url;
};

/**
 * Get all services with optional filters
 */
const getAllServices = async (filters = {}) => {
  const { category, search, location, minPrice, maxPrice, rating, availability, sortBy } = filters;

  const where = {};

  if (category && category !== "all") {
    // If multiple categories are passed (comma-separated or array)
    if (Array.isArray(category)) {
      where.category = { in: category };
    } else if (category.includes(",")) {
      where.category = { in: category.split(",") };
    } else {
      where.category = category;
    }
  }

  if (location && location !== "all") {
    where.location = location;
  }

  if (availability && availability !== "all") {
    where.availability = availability;
  }

  // Price range
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined && minPrice !== "") {
      where.price.gte = parseFloat(minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== "") {
      where.price.lte = parseFloat(maxPrice);
    }
  }

  if (rating !== undefined && rating !== "" && rating !== "0" && parseFloat(rating) > 0) {
    where.rating = {
      gte: parseFloat(rating)
    };
  }

  // Text search query matching title, description or provider name
  if (search && search.trim() !== "") {
    const q = search.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      {
        provider: {
          fullName: { contains: q, mode: "insensitive" }
        }
      }
    ];
  }

  // Order sorting logic
  let orderBy = { createdAt: "desc" }; // default sorting
  if (sortBy === "popularity") {
    orderBy = { reviewCount: "desc" };
  } else if (sortBy === "rating") {
    orderBy = [
      { rating: "desc" },
      { reviewCount: "desc" }
    ];
  } else if (sortBy === "price-asc") {
    orderBy = { price: "asc" };
  } else if (sortBy === "price-desc") {
    orderBy = { price: "desc" };
  } else if (sortBy === "newest") {
    orderBy = { createdAt: "desc" };
  }

  return await prisma.service.findMany({
    where,
    orderBy,
    include: {
      provider: {
        select: {
          id: true,
          fullName: true,
          avatar: true,
          email: true,
          phone: true
        }
      }
    }
  });
};

/**
 * Get service by ID
 */
const getServiceById = async (id) => {
  return await prisma.service.findUnique({
    where: { id },
    include: {
      provider: {
        select: {
          id: true,
          fullName: true,
          avatar: true,
          email: true,
          phone: true
        }
      }
    }
  });
};

/**
 * Get service by Slug
 */
const getServiceBySlug = async (slug) => {
  return await prisma.service.findUnique({
    where: { slug },
    include: {
      provider: {
        select: {
          id: true,
          fullName: true,
          avatar: true,
          email: true,
          phone: true
        }
      }
    }
  });
};

/**
 * Create a new service
 */
const createService = async (serviceData, file) => {
  const { title, description, category, providerId, location, price, priceType, availability, badge } = serviceData;

  // Validate provider exists
  const provider = await prisma.user.findUnique({
    where: { id: providerId }
  });

  if (!provider) {
    throw new Error("Provider user does not exist.");
  }

  if (provider.role !== "PROVIDER" && provider.role !== "ADMIN") {
    throw new Error("Specified provider must have a PROVIDER or ADMIN role.");
  }

  // Upload image to Cloudinary
  if (!file) {
    throw new Error("Service image is required.");
  }
  const imageUrl = await uploadToCloudinary(file);

  // Generate unique slug
  const slug = await generateUniqueSlug(title);

  return await prisma.service.create({
    data: {
      title,
      slug,
      description,
      category,
      providerId,
      location,
      price: parseFloat(price),
      priceType,
      availability,
      badge: badge || null,
      imageUrl,
      rating: 5.0, // Initial defaults
      reviewCount: 0
    },
    include: {
      provider: {
        select: {
          id: true,
          fullName: true,
          avatar: true
        }
      }
    }
  });
};

/**
 * Update service details
 */
const updateService = async (id, serviceData, file) => {
  const existingService = await prisma.service.findUnique({
    where: { id }
  });

  if (!existingService) {
    throw new Error("Service not found.");
  }

  const { title, description, category, location, price, priceType, availability, badge } = serviceData;
  const updateData = {};

  if (title !== undefined) {
    updateData.title = title;
    if (title !== existingService.title) {
      updateData.slug = await generateUniqueSlug(title);
    }
  }

  if (description !== undefined) updateData.description = description;
  if (category !== undefined) updateData.category = category;
  if (location !== undefined) updateData.location = location;
  if (price !== undefined) updateData.price = parseFloat(price);
  if (priceType !== undefined) updateData.priceType = priceType;
  if (availability !== undefined) updateData.availability = availability;
  if (badge !== undefined) updateData.badge = badge || null;

  // If a new image is provided, upload to Cloudinary and delete old image if it is stored in Cloudinary
  if (file) {
    const imageUrl = await uploadToCloudinary(file);
    updateData.imageUrl = imageUrl;

    // Delete old image from Cloudinary if possible
    if (existingService.imageUrl && existingService.imageUrl.includes("cloudinary.com")) {
      try {
        const parts = existingService.imageUrl.split("/upload/");
        if (parts.length >= 2) {
          const pathAfterUpload = parts[1];
          const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
          const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf("."));
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (err) {
        console.error("Failed to delete old service image from Cloudinary:", err);
      }
    }
  }

  return await prisma.service.update({
    where: { id },
    data: updateData,
    include: {
      provider: {
        select: {
          id: true,
          fullName: true,
          avatar: true
        }
      }
    }
  });
};

/**
 * Delete a service
 */
const deleteService = async (id) => {
  const existingService = await prisma.service.findUnique({
    where: { id }
  });

  if (!existingService) {
    throw new Error("Service not found.");
  }

  // Delete image from Cloudinary
  if (existingService.imageUrl && existingService.imageUrl.includes("cloudinary.com")) {
    try {
      const parts = existingService.imageUrl.split("/upload/");
      if (parts.length >= 2) {
        const pathAfterUpload = parts[1];
        const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
        const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf("."));
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (err) {
      console.error("Failed to delete service image from Cloudinary:", err);
    }
  }

  return await prisma.service.delete({
    where: { id }
  });
};

module.exports = {
  getAllServices,
  getServiceById,
  getServiceBySlug,
  createService,
  updateService,
  deleteService
};
