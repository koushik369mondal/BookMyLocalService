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

const getProviderJobs = async (req, res) => {
    try {
        const providerId = req.user.id;
        const jobs = await providerService.getProviderJobs(providerId);
        return res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (err) {
        console.error("Get provider jobs error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch provider jobs."
        });
    }
};

const updateJobStatus = async (req, res) => {
    try {
        const providerId = req.user.id;
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status field is required."
            });
        }

        const updatedJob = await providerService.updateJobStatus(providerId, id, status);
        return res.status(200).json({
            success: true,
            message: `Job status updated to ${status}.`,
            data: updatedJob
        });
    } catch (err) {
        console.error("Update job status error:", err);
        return res.status(400).json({
            success: false,
            message: err.message || "Failed to update job status."
        });
    }
};

const getProviderEarnings = async (req, res) => {
    try {
        const providerId = req.user.id;
        const earningsData = await providerService.getProviderEarnings(providerId);
        return res.status(200).json({
            success: true,
            data: earningsData
        });
    } catch (err) {
        console.error("Get provider earnings error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch provider earnings."
        });
    }
};

const getProviderReviews = async (req, res) => {
    try {
        const providerId = req.user.id;
        const reviewsData = await providerService.getProviderReviews(providerId);
        return res.status(200).json({
            success: true,
            data: reviewsData
        });
    } catch (err) {
        console.error("Get provider reviews error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch provider reviews."
        });
    }
};

const replyToReview = async (req, res) => {
    try {
        const providerId = req.user.id;
        const { id } = req.params;
        const { reply } = req.body;

        if (!reply || !reply.trim()) {
            return res.status(400).json({
                success: false,
                message: "Reply content cannot be empty."
            });
        }

        const updatedReview = await providerService.replyToReview(providerId, id, reply);
        return res.status(200).json({
            success: true,
            message: "Reply published successfully.",
            data: updatedReview
        });
    } catch (err) {
        console.error("Reply to review error:", err);
        return res.status(400).json({
            success: false,
            message: err.message || "Failed to submit review reply."
        });
    }
};

const getProviderAvailability = async (req, res) => {
    try {
        const providerId = req.user.id;
        const availability = await providerService.getProviderAvailability(providerId);
        return res.status(200).json({
            success: true,
            data: availability
        });
    } catch (err) {
        console.error("Get provider availability error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch provider availability schedule."
        });
    }
};

const saveProviderAvailability = async (req, res) => {
    try {
        const providerId = req.user.id;
        const { weeklySchedule, blockedDates } = req.body;

        if (!weeklySchedule) {
            return res.status(400).json({
                success: false,
                message: "weeklySchedule is required."
            });
        }

        const updatedAvailability = await providerService.saveProviderAvailability(
            providerId,
            weeklySchedule,
            blockedDates || []
        );

        return res.status(200).json({
            success: true,
            message: "Availability configurations updated successfully.",
            data: updatedAvailability
        });
    } catch (err) {
        console.error("Save provider availability error:", err);
        return res.status(400).json({
            success: false,
            message: err.message || "Failed to save availability configurations."
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
    getProviderJobs,
    updateJobStatus,
    getProviderEarnings,
    getProviderReviews,
    replyToReview,
    getProviderAvailability,
    saveProviderAvailability,
    getProviderServices,
    createProviderService,
    updateProviderService,
    deleteProviderService
};
