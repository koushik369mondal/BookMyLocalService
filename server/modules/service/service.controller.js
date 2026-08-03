const serviceService = require("./service.service");

/**
 * Get all services
 */
const getAllServices = async (req, res) => {
  try {
    const { category, search, location, minPrice, maxPrice, rating, availability, sortBy } = req.query;
    
    const services = await serviceService.getAllServices({
      category,
      search,
      location,
      minPrice,
      maxPrice,
      rating,
      availability,
      sortBy
    });

    return res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error("Error in getAllServices controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch services."
    });
  }
};

/**
 * Get service by ID
 */
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await serviceService.getServiceById(id);

    if (!service) {
      const serviceBySlug = await serviceService.getServiceBySlug(id);
      if (!serviceBySlug) {
        return res.status(404).json({
          success: false,
          message: "Service not found."
        });
      }
      return res.status(200).json({
        success: true,
        data: serviceBySlug
      });
    }

    return res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error("Error in getServiceById controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch service details."
    });
  }
};

/**
 * Get service by Slug
 */
const getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const service = await serviceService.getServiceBySlug(slug);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error("Error in getServiceBySlug controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch service details."
    });
  }
};

/**
 * Create a service
 */
const createService = async (req, res) => {
  try {
    const { title, description, category, categoryId, location, price, priceType, availability, badge, imageUrl } = req.body;
    
    // Always enforce providerId from authenticated user token
    const providerId = req.user?.id;
    if (!providerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Provider user account ID is missing."
      });
    }

    let catValue = categoryId || category;
    if (!catValue) {
      catValue = await serviceService.resolveCategoryId(null);
    }

    const missing = [];
    if (!title || !title.trim()) missing.push("title");
    if (!description || !description.trim()) missing.push("description");
    if (!location || !location.trim()) missing.push("location");
    if (price === undefined || price === null || isNaN(parseFloat(price))) missing.push("price");

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing or invalid required service field(s): ${missing.join(", ")}`,
        missingFields: missing
      });
    }

    const newService = await serviceService.createService({
      title,
      description,
      categoryId: catValue,
      category: catValue,
      providerId,
      location,
      price,
      priceType: priceType || "/hr",
      availability: availability || "available",
      badge,
      imageUrl
    }, req.file);

    return res.status(201).json({
      success: true,
      message: "Service created successfully.",
      data: newService
    });
  } catch (error) {
    console.error("Error in createService controller:", error);

    // Format Prisma errors clearly
    if (error.code === "P2011" || error.code === "P2012") {
      const field = error.meta?.constraint || error.meta?.target || "required field";
      return res.status(400).json({
        success: false,
        message: `Null constraint violation on field: '${field}'. Please provide a valid value.`
      });
    }

    if (error.code === "P2002") {
      const target = error.meta?.target ? error.meta.target.join(", ") : "field";
      return res.status(400).json({
        success: false,
        message: `A service with this ${target} already exists.`
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: `Foreign key constraint failed. Invalid providerId or categoryId.`
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create service."
    });
  }
};

/**
 * Update a service
 */
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await serviceService.getServiceById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found."
      });
    }

    if (req.user.role !== "ADMIN" && service.providerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this service."
      });
    }

    const updatedService = await serviceService.updateService(id, req.body, req.file);

    return res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      data: updatedService
    });
  } catch (error) {
    console.error("Error in updateService controller:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update service."
    });
  }
};

/**
 * Delete a service
 */
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await serviceService.getServiceById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found."
      });
    }

    if (req.user.role !== "ADMIN" && service.providerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this service."
      });
    }

    await serviceService.deleteService(id);

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully."
    });
  } catch (error) {
    console.error("Error in deleteService controller:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete service."
    });
  }
};

/**
 * Get distinct categories with details
 */
const getServiceCategories = async (req, res) => {
  try {
    const categories = await serviceService.getServiceCategories();
    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error("Error in getServiceCategories controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch categories."
    });
  }
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
