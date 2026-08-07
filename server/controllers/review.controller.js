const prisma = require("../config/prisma");

/**
 * Recalculate and sync Service rating & reviewCount from Review table
 */
const syncServiceRating = async (serviceId) => {
  if (!serviceId) return;
  const serviceReviews = await prisma.review.findMany({
    where: { serviceId }
  });

  const totalReviews = serviceReviews.length;
  const ratingSum = serviceReviews.reduce((sum, r) => sum + (r.rating || 5), 0);
  const avgRating = totalReviews > 0 ? Math.round((ratingSum / totalReviews) * 10) / 10 : 5.0;

  await prisma.service.update({
    where: { id: serviceId },
    data: {
      rating: avgRating,
      reviewCount: totalReviews
    }
  });
};

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
    const statusLower = (booking.bookingStatus || booking.status || "").toLowerCase();
    if (statusLower !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Reviews can only be submitted for completed bookings."
      });
    }

    // Verify no duplicate review
    if (booking.reviewStatus === "REVIEWED" || booking.review) {
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

    const reviewData = {
      bookingId: booking.id,
      serviceId: booking.serviceId,
      providerId: booking.providerId,
      customerId,
      rating: numRating,
      title: title && typeof title === "string" ? title.trim() : null,
      comment: comment.trim()
    };

    const newReview = await prisma.review.create({
      data: reviewData,
      include: {
        customer: { select: { id: true, fullName: true, avatar: true } },
        service: { select: { id: true, title: true } }
      }
    });

    // Update booking reviewStatus to REVIEWED
    await prisma.booking.update({
      where: { id: booking.id },
      data: { reviewStatus: "REVIEWED" }
    });

    // Sync service rating & reviewCount
    await syncServiceRating(booking.serviceId);

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
 * @desc    Update an existing customer review
 * @route   PUT /api/reviews/:id
 * @access  Private (Customer / Author only)
 */
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const customerId = req.user.id;

    const existingReview = await prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found."
      });
    }

    if (existingReview.customerId !== customerId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this review."
      });
    }

    const updateData = {};
    if (rating !== undefined) {
      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be a number between 1 and 5."
        });
      }
      updateData.rating = numRating;
    }

    if (title !== undefined) {
      updateData.title = typeof title === "string" ? title.trim() : null;
    }

    if (comment !== undefined) {
      if (!comment || !comment.trim()) {
        return res.status(400).json({
          success: false,
          message: "Comment cannot be empty."
        });
      }
      updateData.comment = comment.trim();
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        customer: { select: { id: true, fullName: true, avatar: true } },
        service: { select: { id: true, title: true } }
      }
    });

    // Sync service rating & reviewCount
    await syncServiceRating(existingReview.serviceId);

    return res.status(200).json({
      success: true,
      message: "Review updated successfully!",
      data: updatedReview
    });
  } catch (error) {
    console.error("Update review error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update review."
    });
  }
};

/**
 * @desc    Get customer's own submitted reviews
 * @route   GET /api/reviews/my-reviews
 * @access  Private (Customer only)
 */
const getCustomerReviews = async (req, res) => {
  try {
    const customerId = req.user.id;

    const reviews = await prisma.review.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: { id: true, title: true, imageUrl: true } },
        provider: { select: { id: true, fullName: true, avatar: true } },
        booking: { select: { id: true, date: true, time: true } }
      }
    });

    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error("Get customer reviews error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch customer reviews."
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
      reply: r.providerReply || r.reply || null,
      providerReply: r.providerReply || r.reply || null,
      providerReplyAt: r.providerReplyAt ? new Date(r.providerReplyAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null,
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

/**
 * @desc    Get featured testimonials dynamically from database for Home Page
 * @route   GET /api/reviews/testimonials
 * @access  Public
 */
const getFeaturedTestimonials = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        rating: { gte: 4 }
      },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { id: true, fullName: true, avatar: true, city: true } },
        service: { select: { id: true, title: true } }
      }
    });

    const testimonials = reviews.map(r => ({
      id: r.id,
      quote: r.comment,
      title: r.title || "",
      comment: r.comment,
      author: r.customer?.fullName || "Verified Neighbor",
      name: r.customer?.fullName || "Verified Neighbor",
      role: r.service?.title ? `Customer (${r.service.title})` : (r.customer?.city || "Local Customer"),
      avatar: r.customer?.avatar || "",
      rating: Math.round(r.rating),
      providerReply: r.providerReply || r.reply || null,
      providerReplyAt: r.providerReplyAt ? new Date(r.providerReplyAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null,
      reply: r.providerReply || r.reply || null,
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString()
    }));

    return res.status(200).json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error("Get testimonials error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch testimonials."
    });
  }
};

/**
 * @desc    Reply to a review (Provider or Admin)
 * @route   PATCH /api/reviews/:id/reply
 * @access  Private (Provider/Admin)
 */
const replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const providerId = req.user.id;

    if (!reply || !reply.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply content cannot be empty."
      });
    }

    const review = await prisma.review.findUnique({
      where: { id },
      include: { service: { select: { providerId: true } } }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found."
      });
    }

    const isAuthorized = review.providerId === providerId || 
                         (review.service && review.service.providerId === providerId) || 
                         req.user.role === "ADMIN";

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reply to this review."
      });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        providerReply: reply.trim(),
        providerReplyAt: new Date(),
        reply: reply.trim()
      }
    });

    return res.status(200).json({
      success: true,
      message: "Reply published successfully.",
      data: updatedReview
    });
  } catch (error) {
    console.error("Reply to review error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to publish reply."
    });
  }
};

module.exports = {
  createReview,
  updateReview,
  getCustomerReviews,
  getServiceReviews,
  getFeaturedTestimonials,
  replyToReview
};
