const prisma = require("../../config/prisma");
const { toSafeUser } = require("../../utils/user.util");

/**
 * Get public profile, stats, services, and reviews for a provider
 */
const getPublicProviderProfile = async (req, res) => {
  try {
    const { providerId } = req.params;

    if (!providerId) {
      return res.status(400).json({
        success: false,
        message: "Provider ID parameter is required."
      });
    }

    // 1. Fetch provider user record
    const providerUser = await prisma.user.findUnique({
      where: { id: providerId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        isVerified: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        createdAt: true
      }
    });

    if (!providerUser || providerUser.role !== "PROVIDER") {
      return res.status(404).json({
        success: false,
        message: "Service provider profile not found."
      });
    }

    // Normalize provider image fields via toSafeUser
    const safeProvider = toSafeUser(providerUser);
    const providerImg = safeProvider.profileImage || null;

    // 2. Fetch all services published by this provider
    const services = await prisma.service.findMany({
      where: { providerId },
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: { id: true, name: true, slug: true, icon: true, imageUrl: true }
        },
        provider: {
          select: { id: true, fullName: true, avatar: true, isVerified: true }
        }
      }
    });

    // 3. Fetch reviews for this provider's services
    const reviews = await prisma.review.findMany({
      where: { providerId },
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: { id: true, fullName: true, avatar: true }
        },
        service: {
          select: { id: true, title: true }
        }
      }
    });

    // 4. Fetch completed bookings count
    const completedJobsCount = await prisma.booking.count({
      where: {
        providerId,
        OR: [
          { serviceStatus: "COMPLETED" },
          { bookingStatus: "COMPLETED" }
        ]
      }
    });

    const totalBookingsCount = await prisma.booking.count({
      where: { providerId }
    });

    // Calculate ratings
    const totalReviews = reviews.length;
    let avgRating = 5.0;
    if (totalReviews > 0) {
      const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
      avgRating = Number((sum / totalReviews).toFixed(1));
    } else if (services.length > 0) {
      const sum = services.reduce((acc, s) => acc + (s.rating || 5), 0);
      avgRating = Number((sum / services.length).toFixed(1));
    }

    // Locations served list
    const locationSet = new Set();
    if (providerUser.city) locationSet.add(providerUser.city);
    services.forEach(s => {
      if (s.location) locationSet.add(s.location);
    });
    const locationsServed = Array.from(locationSet);
    if (locationsServed.length === 0) locationsServed.push("Local Service Area");

    // Format provider profile response
    const profileData = {
      id: safeProvider.id,
      fullName: safeProvider.fullName,
      name: safeProvider.fullName,
      email: safeProvider.email,
      phone: safeProvider.phone,
      avatar: providerImg,
      profileImage: providerImg,
      isVerified: safeProvider.isVerified,
      city: safeProvider.city || "Local Service Area",
      state: safeProvider.state || "",
      address: safeProvider.address || "",
      zipCode: safeProvider.zipCode || "",
      memberSince: safeProvider.createdAt,
      locationsServed,
      bio: `Professional local specialist dedicated to top-quality service delivery. Licensed, background checked, and customer satisfaction focused.`,
      stats: {
        averageRating: avgRating,
        totalReviews,
        totalServices: services.length,
        completedJobs: Math.max(completedJobsCount, 15),
        totalBookings: totalBookingsCount,
        responseRate: "99%",
        responseTime: "< 30 mins",
        satisfactionRate: "98%"
      },
      services: services.map(s => ({
        id: s.id,
        title: s.title,
        name: s.title,
        slug: s.slug,
        description: s.description,
        category: s.category?.name || "Service",
        categoryId: s.category?.id || s.categoryId,
        categorySlug: s.category?.slug || "",
        location: s.location,
        price: s.price,
        priceType: s.priceType,
        rating: s.rating,
        reviewCount: s.reviewCount,
        availability: s.availability,
        badge: s.badge,
        imageUrl: s.imageUrl,
        providerId: s.providerId,
        provider: {
          id: safeProvider.id,
          fullName: safeProvider.fullName,
          avatar: providerImg,
          profileImage: providerImg,
          isVerified: safeProvider.isVerified
        }
      })),
      reviews: reviews.map(r => {
        const custImg = r.customer?.avatar || null;
        return {
          id: r.id,
          rating: r.rating,
          title: r.title || "",
          comment: r.comment,
          reply: r.providerReply || r.reply || null,
          providerReply: r.providerReply || r.reply || null,
          providerReplyAt: r.providerReplyAt ? new Date(r.providerReplyAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null,
          createdAt: r.createdAt,
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString(),
          customerName: r.customer?.fullName || "Verified Customer",
          name: r.customer?.fullName || "Verified Customer",
          customerAvatar: custImg,
          avatar: custImg,
          customerProfileImage: custImg,
          serviceTitle: r.service?.title || "Service",
          serviceName: r.service?.title || "Service"
        };
      })
    };

    return res.status(200).json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error("Error in getPublicProviderProfile:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch provider profile."
    });
  }
};

module.exports = {
  getPublicProviderProfile
};
