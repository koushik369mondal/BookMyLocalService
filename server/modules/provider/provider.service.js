const prisma = require("../../config/prisma");
const notificationService = require("../notification/notification.service");


class ProviderService {
    /**
     * Compute Provider Dashboard KPIs dynamically from database
     */
    async getProviderDashboardData(providerId) {
        try {
            if (!providerId) {
                return {
                    totalServices: 0,
                    activeServices: 0,
                    totalBookings: 0,
                    completedJobs: 0,
                    pendingJobs: 0,
                    monthlyRevenue: 0,
                    totalEarnings: 0,
                    averageRating: 5.0,
                    services: [],
                    recentBookings: []
                };
            }

            const servicesCount = await prisma.service.count({
                where: { providerId }
            });

            const activeServicesCount = await prisma.service.count({
                where: { providerId, availability: { not: "off" } }
            });

            const totalBookings = await prisma.booking.count({
                where: { providerId }
            });

            const completedJobs = await prisma.booking.count({
                where: {
                    providerId,
                    OR: [
                        { bookingStatus: "COMPLETED" },
                        { status: "completed" }
                    ]
                }
            });

            const pendingJobs = await prisma.booking.count({
                where: {
                    providerId,
                    OR: [
                        { bookingStatus: "PENDING" },
                        { status: "pending" }
                    ]
                }
            });

            const earningsResult = await prisma.booking.aggregate({
                where: { providerId, paymentStatus: "PAID" },
                _sum: { total: true }
            });

            const reviewsAgg = await prisma.review.aggregate({
                where: { providerId },
                _avg: { rating: true },
                _count: { id: true }
            });

            const services = await prisma.service.findMany({
                where: { providerId },
                orderBy: { createdAt: "desc" },
                include: {
                    category: { select: { name: true } },
                    bookings: { select: { id: true, total: true, paymentStatus: true } }
                }
            });

            const formattedServices = (services || []).map(s => ({
                id: s.id,
                title: s.title || "Service",
                slug: s.slug || s.id,
                category: typeof s.category === "object" ? s.category?.name : (s.category || "General"),
                location: s.location || "Local Service Area",
                price: typeof s.price === "number" ? s.price : 0,
                priceType: s.priceType || "/service",
                rating: typeof s.rating === "number" ? s.rating : 5.0,
                reviewCount: s.reviewCount || 0,
                availability: s.availability || "available",
                badge: s.badge || null,
                imageUrl: s.imageUrl || "",
                status: "Active",
                bookingsCount: s.bookings ? s.bookings.length : 0,
                revenue: s.bookings ? s.bookings.reduce((sum, b) => (b.paymentStatus || "").toUpperCase() === "PAID" ? sum + (b.total || 0) : sum, 0) : 0
            }));

            const recentBookings = await prisma.booking.findMany({
                where: { providerId },
                orderBy: { createdAt: "desc" },
                take: 5,
                include: {
                    customer: { select: { id: true, fullName: true, email: true, phone: true, avatar: true } },
                    service: { select: { id: true, title: true, category: { select: { name: true } }, imageUrl: true } }
                }
            });

            const formattedBookings = (recentBookings || []).map(b => ({
                id: b.id,
                customerId: b.customerId,
                customer: b.customer ? {
                    fullName: b.customer.fullName || b.billingName || "Customer",
                    email: b.customer.email || b.billingEmail || "N/A",
                    phone: b.customer.phone || b.billingPhone || "N/A",
                    avatar: b.customer.avatar || "",
                    profileImage: b.customer.avatar || ""
                } : { fullName: b.billingName || "Customer", email: b.billingEmail || "N/A", phone: b.billingPhone || "N/A", avatar: "", profileImage: "" },
                service: b.service ? {
                    title: b.service.title || "Service",
                    category: typeof b.service.category === "object" ? b.service.category?.name : (b.service.category || "General"),
                    imageUrl: b.service.imageUrl || ""
                } : { title: "Service", category: "General", imageUrl: "" },
                plan: b.plan || "Standard",
                date: b.date || "",
                time: b.time || "",
                total: b.total || 0,
                status: b.bookingStatus || b.status || "pending",
                paymentStatus: b.paymentStatus || "PENDING"
            }));

            return {
                totalServices: servicesCount || 0,
                activeServices: activeServicesCount || 0,
                totalBookings: totalBookings || 0,
                completedJobs: completedJobs || 0,
                pendingJobs: pendingJobs || 0,
                monthlyRevenue: earningsResult?._sum?.total || 0,
                totalEarnings: earningsResult?._sum?.total || 0,
                averageRating: reviewsAgg?._avg?.rating ? Math.round(reviewsAgg._avg.rating * 10) / 10 : 5.0,
                services: formattedServices,
                recentBookings: formattedBookings
            };
        } catch (err) {
            console.error("Error in getProviderDashboardData service:", err);
            return {
                totalServices: 0,
                activeServices: 0,
                totalBookings: 0,
                completedJobs: 0,
                pendingJobs: 0,
                monthlyRevenue: 0,
                totalEarnings: 0,
                averageRating: 5.0,
                services: [],
                recentBookings: []
            };
        }
    }

    /**
     * Fetch assigned bookings (jobs) for provider
     */
    async getProviderJobs(providerId) {
        const bookings = await prisma.booking.findMany({
            where: { providerId },
            orderBy: { createdAt: "desc" },
            include: {
                customer: { select: { id: true, fullName: true, email: true, phone: true, avatar: true, address: true, city: true } },
                service: { 
                    select: { 
                        id: true, 
                        title: true, 
                        category: { select: { name: true } }, 
                        imageUrl: true, 
                        price: true, 
                        priceType: true 
                    } 
                },
                review: true
            }
        });

        return bookings.map(b => ({
            id: b.id,
            customer: b.customer?.fullName || b.billingName || "Customer",
            customerPhone: b.customer?.phone || b.billingPhone || "N/A",
            customerEmail: b.customer?.email || b.billingEmail || "N/A",
            service: b.service?.title || "Local Service",
            serviceCategory: typeof b.service?.category === "object" ? b.service.category?.name : (b.service?.category || "General"),
            date: b.date,
            time: b.time,
            price: b.total,
            status: b.bookingStatus || b.status,
            bookingStatus: b.bookingStatus,
            serviceStatus: b.serviceStatus,
            reviewStatus: b.reviewStatus,
            review: b.review,
            paymentStatus: b.paymentStatus,
            paymentMethod: b.paymentMethod,
            address: b.street && b.city ? `${b.street}, ${b.city}` : (b.customer?.city || "Local Service Area")
        }));
    }

    /**
     * Update job status in database with strict state machine validation:
     * PENDING -> CONFIRMED / CANCELLED
     * CONFIRMED -> IN_PROGRESS / CANCELLED
     * IN_PROGRESS -> COMPLETED
     */
    async updateJobStatus(providerId, bookingId, statusAction) {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId }
        });

        if (!booking || booking.providerId !== providerId) {
            throw new Error("Booking not found or unauthorized.");
        }

        const currentBStatus = (booking.bookingStatus || booking.status || "PENDING").toUpperCase();
        const actionInput = String(statusAction).toLowerCase().trim();

        let targetBStatus;
        let targetServiceStatus = booking.serviceStatus;

        if (actionInput === "accept" || actionInput === "confirm" || actionInput === "confirmed") {
            targetBStatus = "CONFIRMED";
            targetServiceStatus = "NOT_STARTED";
        } else if (actionInput === "reject" || actionInput === "cancel" || actionInput === "cancelled") {
            targetBStatus = "CANCELLED";
        } else if (actionInput === "start" || actionInput === "in_service" || actionInput === "in_progress") {
            targetBStatus = "IN_PROGRESS";
            targetServiceStatus = "ONGOING";
        } else if (actionInput === "complete" || actionInput === "completed") {
            targetBStatus = "COMPLETED";
            targetServiceStatus = "COMPLETED";
        } else {
            throw new Error(`Unknown job action status '${statusAction}'. Allowed: accept, reject, start, complete.`);
        }

        // Validate state transition rules
        if (targetBStatus === "CONFIRMED" && currentBStatus !== "PENDING") {
            throw new Error(`Cannot accept booking in '${currentBStatus}' status. Booking must be PENDING.`);
        }
        if (targetBStatus === "IN_PROGRESS" && currentBStatus !== "CONFIRMED") {
            throw new Error(`Cannot start service for booking in '${currentBStatus}' status. Booking must be CONFIRMED.`);
        }
        if (targetBStatus === "COMPLETED" && (currentBStatus !== "IN_PROGRESS" && currentBStatus !== "CONFIRMED")) {
            throw new Error(`Cannot complete booking in '${currentBStatus}' status. Service must be IN_PROGRESS or CONFIRMED.`);
        }
        if (targetBStatus === "CANCELLED" && (currentBStatus === "COMPLETED" || currentBStatus === "CANCELLED")) {
            throw new Error(`Cannot cancel a booking that is already '${currentBStatus}'.`);
        }

        const updateData = {
            bookingStatus: targetBStatus,
            status: targetBStatus.toLowerCase(),
            serviceStatus: targetServiceStatus
        };

        // If completing a cash job, auto mark payment as PAID
        if (targetBStatus === "COMPLETED" && ((booking.paymentMethod || "").toUpperCase() === "CASH_ON_JOB" || (booking.paymentMethod || "").toLowerCase() === "cash")) {
            updateData.paymentStatus = "PAID";
            updateData.paidAt = new Date();
            updateData.collectedById = providerId;
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: updateData,
            include: {
                customer: { select: { id: true, fullName: true, email: true } },
                service: { select: { id: true, title: true } }
            }
        });

        try {
            const serviceTitle = updatedBooking.service?.title || "Service";
            if (targetBStatus === "CONFIRMED") {
                await notificationService.createNotification({
                    userId: updatedBooking.customerId,
                    type: "BOOKING_CONFIRMED",
                    title: "Booking Confirmed",
                    message: `The provider has accepted and confirmed your booking for "${serviceTitle}".`,
                    referenceId: updatedBooking.id,
                    referenceType: "BOOKING"
                });
            } else if (targetBStatus === "IN_PROGRESS") {
                await notificationService.createNotification({
                    userId: updatedBooking.customerId,
                    type: "SERVICE_STARTED",
                    title: "Service Started",
                    message: `The provider has started work on your service: "${serviceTitle}".`,
                    referenceId: updatedBooking.id,
                    referenceType: "BOOKING"
                });
            } else if (targetBStatus === "COMPLETED") {
                await Promise.all([
                    notificationService.createNotification({
                        userId: updatedBooking.customerId,
                        type: "SERVICE_COMPLETED",
                        title: "Service Completed",
                        message: `Your service "${serviceTitle}" has been completed. Please rate your experience!`,
                        referenceId: updatedBooking.id,
                        referenceType: "BOOKING"
                    }),
                    notificationService.createNotification({
                        userId: providerId,
                        type: "SERVICE_COMPLETED",
                        title: "Job Completed",
                        message: `Job for "${serviceTitle}" marked as completed.`,
                        referenceId: updatedBooking.id,
                        referenceType: "BOOKING"
                    })
                ]);
            } else if (targetBStatus === "CANCELLED") {
                await Promise.all([
                    notificationService.createNotification({
                        userId: updatedBooking.customerId,
                        type: "BOOKING_CANCELLED",
                        title: "Booking Cancelled",
                        message: `Your booking for "${serviceTitle}" has been cancelled.`,
                        referenceId: updatedBooking.id,
                        referenceType: "BOOKING"
                    }),
                    notificationService.createNotification({
                        userId: providerId,
                        type: "BOOKING_CANCELLED",
                        title: "Booking Cancelled",
                        message: `Booking for "${serviceTitle}" was cancelled.`,
                        referenceId: updatedBooking.id,
                        referenceType: "BOOKING"
                    })
                ]);
            }
        } catch (notifErr) {
            console.error("Failed to generate job status notification:", notifErr);
        }

        return updatedBooking;
    }

    /**
     * Compute provider earnings & transaction history dynamically from database
     */
    async getProviderEarnings(providerId) {
        const bookings = await prisma.booking.findMany({
            where: { providerId },
            orderBy: { createdAt: "desc" },
            include: {
                customer: { select: { id: true, fullName: true } },
                service: { select: { id: true, title: true } }
            }
        });

        let clearedBalance = 0;
        let pendingBalance = 0;

        const transactions = bookings.map(b => {
            const isCleared = (b.paymentStatus || "").toUpperCase() === "PAID" || (b.bookingStatus || b.status || "").toLowerCase() === "completed";
            if (isCleared) {
                clearedBalance += b.total;
            } else {
                pendingBalance += b.total;
            }

            return {
                id: `TXN-${b.id.slice(-6).toUpperCase()}`,
                bookingId: b.id,
                customerName: b.customer?.fullName || b.billingName || "Customer",
                serviceName: b.service?.title || "Local Service",
                date: b.date || b.createdAt.toISOString().split("T")[0],
                amount: b.total,
                status: isCleared ? "cleared" : "processing"
            };
        });

        // Group daily & monthly earnings dynamically
        const daysMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        bookings.forEach(b => {
            if ((b.paymentStatus || "").toUpperCase() === "PAID" || (b.bookingStatus || b.status || "").toLowerCase() === "completed") {
                const dateObj = new Date(b.createdAt);
                const dayName = dayNames[dateObj.getDay()];
                if (daysMap[dayName] !== undefined) {
                    daysMap[dayName] += b.total;
                }
            }
        });

        const dailyEarnings = Object.keys(daysMap).map(label => ({
            label,
            amount: Math.round(daysMap[label] * 100) / 100
        }));

        const payoutHistory = bookings
            .filter(b => ((b.bookingStatus || b.status || "").toLowerCase() === "completed") && ((b.paymentStatus || "").toUpperCase() === "PAID"))
            .slice(0, 5)
            .map((b) => ({
                id: `PAY-${b.id.slice(-6).toUpperCase()}`,
                date: b.date || b.createdAt.toISOString().split("T")[0],
                amount: b.total,
                method: b.paymentMethod ? `${b.paymentMethod.toUpperCase()} Direct Settlement` : "UPI / Direct Transfer",
                status: "success"
            }));

        return {
            totalEarnings: Math.round(clearedBalance * 100) / 100,
            clearedBalance: Math.round(clearedBalance * 100) / 100,
            pendingBalance: Math.round(pendingBalance * 100) / 100,
            transactions,
            dailyEarnings,
            monthlyEarnings: dailyEarnings,
            payoutHistory
        };
    }

    /**
     * Fetch provider reviews & aggregate ratings
     */
    async getProviderReviews(providerId) {
        try {
            if (!providerId) {
                return {
                    averageRating: 5.0,
                    totalReviews: 0,
                    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                    responseRate: 100,
                    recommendationRate: 100,
                    reviewsList: []
                };
            }

            const providerServices = await prisma.service.findMany({
                where: { providerId },
                select: { id: true }
            });
            const serviceIds = providerServices.map(s => s.id);

            const whereClause = serviceIds.length > 0 
                ? { OR: [{ providerId }, { serviceId: { in: serviceIds } }] } 
                : { providerId };

            const reviews = await prisma.review.findMany({
                where: whereClause,
                orderBy: { createdAt: "desc" },
                include: {
                    customer: { select: { id: true, fullName: true, avatar: true } },
                    service: { select: { id: true, title: true } }
                }
            });

            if (!reviews || reviews.length === 0) {
                return {
                    averageRating: 5.0,
                    totalReviews: 0,
                    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                    responseRate: 100,
                    recommendationRate: 100,
                    reviewsList: []
                };
            }

            const totalReviews = reviews.length;
            let ratingSum = 0;
            const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            let repliedCount = 0;
            let recommendedCount = 0;

            reviews.forEach(r => {
                const rating = typeof r.rating === "number" ? r.rating : 5;
                ratingSum += rating;
                const star = Math.min(5, Math.max(1, Math.round(rating)));
                if (distribution[star] !== undefined) distribution[star]++;
                const hasRep = (r.providerReply && r.providerReply.trim()) || (r.reply && r.reply.trim());
                if (hasRep) repliedCount++;
                if (rating >= 4) recommendedCount++;
            });

            const averageRating = totalReviews > 0 ? Math.round((ratingSum / totalReviews) * 10) / 10 : 5.0;
            const responseRate = totalReviews > 0 ? Math.round((repliedCount / totalReviews) * 100) : 100;
            const recommendationRate = totalReviews > 0 ? Math.round((recommendedCount / totalReviews) * 100) : 100;

            const reviewsList = reviews.map(r => ({
                id: r.id,
                name: r.customer?.fullName || "Verified Customer",
                avatar: r.customer?.avatar || "",
                profileImage: r.customer?.avatar || "",
                serviceName: r.service?.title || "Service",
                rating: typeof r.rating === "number" ? r.rating : 5,
                title: r.title || "",
                comment: r.comment || "",
                date: r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                reply: r.providerReply || r.reply || "",
                providerReply: r.providerReply || r.reply || "",
                providerReplyAt: r.providerReplyAt ? new Date(r.providerReplyAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null
            }));

            return {
                averageRating,
                totalReviews,
                distribution,
                responseRate,
                recommendationRate,
                reviewsList
            };
        } catch (err) {
            console.error("Error in getProviderReviews service:", err);
            return {
                averageRating: 5.0,
                totalReviews: 0,
                distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                responseRate: 100,
                recommendationRate: 100,
                reviewsList: []
            };
        }
    }

    /**
     * Reply to a customer review in database
     */
    async replyToReview(providerId, reviewId, reply) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
            include: { service: { select: { providerId: true } } }
        });

        if (!review) {
            throw new Error("Review not found.");
        }

        const isAuthorized = review.providerId === providerId || (review.service && review.service.providerId === providerId);

        if (!isAuthorized) {
            throw new Error("Unauthorized to reply to this review.");
        }

        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: {
                providerReply: reply.trim(),
                providerReplyAt: new Date(),
                reply: reply.trim()
            }
        });

        try {
            await notificationService.createNotification({
                userId: review.customerId,
                type: "REVIEW_REPLIED",
                title: "Provider Replied to Your Review",
                message: `The provider replied: "${reply.trim().slice(0, 60)}${reply.length > 60 ? "..." : ""}"`,
                referenceId: review.id,
                referenceType: "REVIEW"
            });
        } catch (notifErr) {
            console.error("Failed to generate review reply notification:", notifErr);
        }

        return updatedReview;
    }

    /**
     * Fetch provider availability schedule from database
     */
    async getProviderAvailability(providerId) {
        let availability = await prisma.availability.findUnique({
            where: { providerId }
        });

        if (!availability) {
            const defaultSchedule = {
                Monday: { active: true, slots: [{ id: "1", start: "09:00 AM", end: "05:00 PM" }] },
                Tuesday: { active: true, slots: [{ id: "2", start: "09:00 AM", end: "05:00 PM" }] },
                Wednesday: { active: true, slots: [{ id: "3", start: "09:00 AM", end: "05:00 PM" }] },
                Thursday: { active: true, slots: [{ id: "4", start: "09:00 AM", end: "05:00 PM" }] },
                Friday: { active: true, slots: [{ id: "5", start: "09:00 AM", end: "05:00 PM" }] },
                Saturday: { active: false, slots: [] },
                Sunday: { active: false, slots: [] }
            };

            availability = await prisma.availability.create({
                data: {
                    providerId,
                    weeklySchedule: defaultSchedule,
                    blockedDates: []
                }
            });
        }

        return availability;
    }

    /**
     * Save provider availability schedule to database
     */
    async saveProviderAvailability(providerId, weeklySchedule, blockedDates) {
        return await prisma.availability.upsert({
            where: { providerId },
            update: {
                weeklySchedule,
                blockedDates
            },
            create: {
                providerId,
                weeklySchedule,
                blockedDates
            }
        });
    }
}

module.exports = new ProviderService();
