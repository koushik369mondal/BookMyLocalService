const serviceRepository = require("../repositories/service.repository");
const userRepository = require("../repositories/user.repository");
const cloudinary = require("../config/cloudinary");

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const generateUniqueSlug = async (title) => {
  let slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const existing = await serviceRepository.findBySlug(uniqueSlug);
    if (!existing) break;
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

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

const getAllServices = async (filters = {}) => {
  const { category, search, location, minPrice, maxPrice, rating, availability, sortBy } = filters;
  const where = {};

  if (category && category !== "all") {
    if (Array.isArray(category)) {
      where.category = { in: category };
    } else if (category.includes(",")) {
      where.category = { in: category.split(",") };
    } else {
      where.category = category;
    }
  }

  if (location && location !== "all") where.location = location;
  if (availability && availability !== "all") where.availability = availability;

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined && minPrice !== "") where.price.gte = parseFloat(minPrice);
    if (maxPrice !== undefined && maxPrice !== "") where.price.lte = parseFloat(maxPrice);
  }

  if (rating !== undefined && rating !== "" && rating !== "0" && parseFloat(rating) > 0) {
    where.rating = { gte: parseFloat(rating) };
  }

  if (search && search.trim() !== "") {
    const q = search.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { provider: { fullName: { contains: q, mode: "insensitive" } } }
    ];
  }

  let orderBy = { createdAt: "desc" };
  if (sortBy === "popularity") orderBy = { reviewCount: "desc" };
  else if (sortBy === "rating") orderBy = [{ rating: "desc" }, { reviewCount: "desc" }];
  else if (sortBy === "price-asc") orderBy = { price: "asc" };
  else if (sortBy === "price-desc") orderBy = { price: "desc" };
  else if (sortBy === "newest") orderBy = { createdAt: "desc" };

  return await serviceRepository.findMany(where, orderBy);
};

const getServiceById = async (id) => serviceRepository.findById(id);

const getServiceBySlug = async (slug) => serviceRepository.findBySlug(slug);

const createService = async (serviceData, file) => {
  const { title, description, category, providerId, location, price, priceType, availability, badge } = serviceData;

  const provider = await userRepository.findById(providerId);
  if (!provider) throw new Error("Provider user does not exist.");
  if (provider.role !== "PROVIDER" && provider.role !== "ADMIN") {
    throw new Error("Specified provider must have a PROVIDER or ADMIN role.");
  }

  if (!file) throw new Error("Service image is required.");
  const imageUrl = await uploadToCloudinary(file);
  const slug = await generateUniqueSlug(title);

  return await serviceRepository.create({
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
    rating: 5.0,
    reviewCount: 0
  });
};

const updateService = async (id, serviceData, file) => {
  const existingService = await serviceRepository.findById(id);
  if (!existingService) throw new Error("Service not found.");

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

  if (file) {
    const imageUrl = await uploadToCloudinary(file);
    updateData.imageUrl = imageUrl;
    if (existingService.imageUrl && existingService.imageUrl.includes("cloudinary.com")) {
      try {
        const parts = existingService.imageUrl.split("/upload/");
        if (parts.length >= 2) {
          const pathWithoutVersion = parts[1].replace(/^v\d+\//, "");
          const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf("."));
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (err) {
        console.error("Failed to delete old service image from Cloudinary:", err);
      }
    }
  }

  return await serviceRepository.update(id, updateData);
};

const deleteService = async (id) => {
  const existingService = await serviceRepository.findById(id);
  if (!existingService) throw new Error("Service not found.");

  if (existingService.imageUrl && existingService.imageUrl.includes("cloudinary.com")) {
    try {
      const parts = existingService.imageUrl.split("/upload/");
      if (parts.length >= 2) {
        const pathWithoutVersion = parts[1].replace(/^v\d+\//, "");
        const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf("."));
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (err) {
      console.error("Failed to delete service image from Cloudinary:", err);
    }
  }

  return await serviceRepository.delete(id);
};

const getServiceCategories = async () => {
  const services = await serviceRepository.findMany();
  const categoryMap = {};

  services.forEach(service => {
    const cat = service.category;
    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        name: cat,
        serviceCount: 0,
        providerIds: new Set(),
        imageUrl: service.imageUrl
      };
    }

    categoryMap[cat].serviceCount += 1;
    if (service.provider) {
      categoryMap[cat].providerIds.add(service.provider.id);
    }
  });

  const descriptions = {
    "Home Cleaning": "Professional cleaning services for a spotless, healthy home environment.",
    "Plumbing": "Reliable leakage repairs, pipe fitting, and sudden clog removals by Verified plumbers.",
    "Electrical": "Certified electricians for smart home automation, wiring installation, and upgrades.",
    "Moving & Packing": "Secure wrapping, loading, and transit services for stress-free relocations.",
    "Lawn & Garden": "Expert landscaping, grass mowing, and garden upkeep by professional arborists.",
    "Wellness & Personal": "Revitalizing massages, personalized fitness plans, and well-being programs."
  };

  const images = {
    "Home Cleaning": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    "Plumbing": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    "Electrical": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    "Moving & Packing": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80",
    "Lawn & Garden": "https://images.unsplash.com/photo-1558905619-1715497e68c6?auto=format&fit=crop&w=600&q=80",
    "Wellness & Personal": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
  };

  return Object.keys(categoryMap).map(name => {
    const data = categoryMap[name];
    return {
      name,
      description: descriptions[name] || `Explore top-rated services for ${name} category.`,
      imageUrl: images[name] || data.imageUrl,
      serviceCount: data.serviceCount,
      providerCount: data.providerIds.size
    };
  });
};

module.exports = {
  getAllServices,
  getServiceById,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  getServiceCategories
};
