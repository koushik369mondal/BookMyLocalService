const prisma = require("../config/prisma");

/**
 * @desc    Create a review for a completed booking
 * @route   POST /api/reviews
 * @access  Private (Customer only)
 */
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, title, comment } = req.body;
    const customerId = req.user.id;

    if (!bookingId || !rating || !comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Booking ID, rating (1-5), and comment are required."
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5."
      });
    }

    // Find the booking with review relation
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    // Verify ownership
    if (booking.customerId !== customerId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to submit a review for this booking."
      });
    }

    // Verify booking is COMPLETED
    if (booking.status.toLowerCase() !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Reviews can only be submitted for completed bookings."
      });
    }

    // Verify no duplicate review
    if (booking.review) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review for this booking."
      });
    }

    const existingReview = await prisma.review.findUnique({
      where: { bookingId }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review for this booking."
      });
    }

    // Create the review data object safely
    const reviewData = {
      bookingId: booking.id,
      serviceId: booking.serviceId,
      providerId: booking.providerId,
      customerId,
      rating: numRating,
      comment: comment.trim()
    };

    if (title && typeof title === "string" && title.trim()) {
      reviewData.title = title.trim();
    }

    // Create the review
    let newReview;
    try {
      newReview = await prisma.review.create({
        data: reviewData,
        include: {
          customer: { select: { id: true, fullName: true, avatar: true } },
          service: { select: { id: true, title: true } }
        }
      });
    } catch (dbErr) {
      // Fallback if title column does not exist in DB yet
      if (dbErr.message && (dbErr.message.includes("Unknown argument `title`") || dbErr.message.includes("title"))) {
        delete reviewData.title;
        newReview = await prisma.review.create({
          data: reviewData,
          include: {
            customer: { select: { id: true, fullName: true, avatar: true } },
            service: { select: { id: true, title: true } }
          }
        });
      } else {
        throw dbErr;
      }
    }

    // Update Service rating and reviewCount
    const serviceReviews = await prisma.review.findMany({
      where: { serviceId: booking.serviceId }
    });

    const totalReviews = serviceReviews.length;
    const ratingSum = serviceReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalReviews > 0 ? Math.round((ratingSum / totalReviews) * 10) / 10 : 5.0;

    await prisma.service.update({
      where: { id: booking.serviceId },
      data: {
        rating: avgRating,
        reviewCount: totalReviews
      }
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      data: newReview
    });

  } catch (error) {
    console.error("Create review error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to submit review."
    });
  }
};

/**
 * @desc    Get reviews for a service
 * @route   GET /api/reviews/service/:serviceId
 * @access  Public
 */
const getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { serviceId },
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { id: true, fullName: true, avatar: true } }
      }
    });

    const totalReviews = reviews.length;
    let ratingSum = 0;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach(r => {
      ratingSum += r.rating;
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      if (distribution[star] !== undefined) distribution[star]++;
    });

    const averageRating = totalReviews > 0 ? Math.round((ratingSum / totalReviews) * 10) / 10 : 5.0;

    const formattedReviews = reviews.map(r => ({
      id: r.id,
      name: r.customer?.fullName || "Verified Customer",
      avatar: r.customer?.avatar || null,
      rating: r.rating,
      title: r.title || "",
      comment: r.comment || "",
      reply: r.reply || null,
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString()
    }));

    return res.status(200).json({
      success: true,
      data: {
        reviews: formattedReviews,
        averageRating,
        totalReviews,
        distribution
      }
    });
  } catch (error) {
    console.error("Get service reviews error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reviews."
    });
  }
};

module.exports = {
  createReview,
  getServiceReviews
};
