const providerService = require("./provider.service");
const serviceService = require("../service/service.service");
const prisma = require("../../config/prisma");

const getProviderDashboard = async (req, res) => {
    try {
        const providerId = req.user.id;
        const data = await providerService.getProviderDashboardData(providerId);
        return res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        console.error("Provider dashboard controller error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch provider dashboard metrics."
        });
    }
};

/**
 * Get provider's own services from database
 */
const getProviderServices = async (req, res) => {
    try {
        const providerId = req.user.id;
        const services = await prisma.service.findMany({
            where: { providerId },
            orderBy: { createdAt: "desc" },
            include: {
                provider: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatar: true,
                        isVerified: true
                    }
                },
                bookings: {
                    select: {
                        id: true,
                        total: true,
                        paymentStatus: true
                    }
                }
            }
        });

        // Compute live metrics for each service
        const formatted = services.map(s => {
            const bookingsCount = s.bookings ? s.bookings.length : 0;
            const revenue = s.bookings
                ? s.bookings.reduce((sum, b) => b.paymentStatus === "paid" ? sum + (b.total || 0) : sum, 0)
                : 0;

            return {
                id: s.id,
                title: s.title,
                slug: s.slug,
                description: s.description,
                category: s.category,
                location: s.location,
                price: s.price,
                priceType: s.priceType,
                rating: s.rating,
                reviewCount: s.reviewCount,
                availability: s.availability,
                badge: s.badge,
                imageUrl: s.imageUrl,
                status: "Active",
                bookingsCount,
                revenue,
                providerId: s.providerId,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt
            };
        });

        return res.status(200).json({
            success: true,
            count: formatted.length,
            data: formatted
        });
    } catch (err) {
        console.error("Get provider services error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch provider services."
        });
    }
};

/**
 * Create a new service for logged-in provider in database
 */
const createProviderService = async (req, res) => {
    try {
        const { title, description, category, location, price, priceType, availability, badge, imageUrl } = req.body;
        const providerId = req.user.id;

        if (!title || !description || !category || !location || !price) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: title, description, category, location, price."
            });
        }

        const newService = await serviceService.createService({
            title,
            description,
            category,
            providerId,
            location,
            price,
            priceType: priceType || "fixed",
            availability: availability || "available",
            badge,
            imageUrl
        }, req.file);

        return res.status(201).json({
            success: true,
            message: "Service created successfully in database.",
            data: newService
        });
    } catch (err) {
        console.error("Create provider service error:", err);
        return res.status(400).json({
            success: false,
            message: err.message || "Failed to create service in database."
        });
    }
};

/**
 * Update provider's service in database
 */
const updateProviderService = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.user.id;

        const service = await serviceService.getServiceById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found in database."
            });
        }

        if (req.user.role !== "ADMIN" && service.providerId !== providerId) {
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
    } catch (err) {
        console.error("Update provider service error:", err);
        return res.status(400).json({
            success: false,
            message: err.message || "Failed to update service."
        });
    }
};

/**
 * Delete provider's service from database
 */
const deleteProviderService = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.user.id;

        const service = await serviceService.getServiceById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found in database."
            });
        }

        if (req.user.role !== "ADMIN" && service.providerId !== providerId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this service."
            });
        }

        await serviceService.deleteService(id);

        return res.status(200).json({
            success: true,
            message: "Service deleted successfully from database."
        });
    } catch (err) {
        console.error("Delete provider service error:", err);
        return res.status(400).json({
            success: false,
            message: err.message || "Failed to delete service."
        });
    }
};

module.exports = {
    getProviderDashboard,
    getProviderServices,
    createProviderService,
    updateProviderService,
    deleteProviderService
};
