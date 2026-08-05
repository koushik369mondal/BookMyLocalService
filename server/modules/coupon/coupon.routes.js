const express = require("express");
const router = express.Router();
const {
    createCoupon,
    getAllCoupons,
    toggleCouponStatus,
    deleteCoupon,
    validateCoupon
} = require("./coupon.controller");
const { protect } = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

// Customer/Public validation endpoint
router.post("/validate", protect, validateCoupon);

// Admin Coupon Management endpoints (handles both /api/admin/coupons and /api/coupons/admin)
router.post("/", adminMiddleware, createCoupon);
router.get("/", adminMiddleware, getAllCoupons);
router.post("/admin", adminMiddleware, createCoupon);
router.get("/admin", adminMiddleware, getAllCoupons);
router.patch("/:id/toggle", adminMiddleware, toggleCouponStatus);
router.patch("/admin/:id/toggle", adminMiddleware, toggleCouponStatus);
router.delete("/:id", adminMiddleware, deleteCoupon);
router.delete("/admin/:id", adminMiddleware, deleteCoupon);

module.exports = router;
