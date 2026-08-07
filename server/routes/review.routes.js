const express = require("express");
const router = express.Router();
const { 
  createReview, 
  updateReview, 
  getCustomerReviews, 
  getServiceReviews, 
  getFeaturedTestimonials, 
  replyToReview 
} = require("../controllers/review.controller");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.get("/my-reviews", protect, getCustomerReviews);
router.get("/testimonials", getFeaturedTestimonials);
router.get("/service/:serviceId", getServiceReviews);
router.patch("/:id/reply", protect, replyToReview);

module.exports = router;
