const couponService = require("./coupon.service");

/**
 * Create a new coupon code (Admin only)
 */
const createCoupon = async (req, res) => {
    try {
        const coupon = await couponService.createCoupon(req.body);
        return res.status(201).json({
            success: true,
            message: `Coupon '${coupon.code}' created successfully.`,
            data: coupon
        });
    } catch (error) {
        console.error("Create coupon error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to create coupon."
        });
    }
};

/**
 * Get all coupons (Admin only)
 */
const getAllCoupons = async (req, res) => {
    try {
        const { search } = req.query;
        const coupons = await couponService.getAllCoupons(search);
        return res.status(200).json({
            success: true,
            data: coupons
        });
    } catch (error) {
        console.error("Get all coupons error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch coupons."
        });
    }
};

/**
 * Toggle coupon active status (Admin only)
 */
const toggleCouponStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await couponService.toggleCouponStatus(id);
        return res.status(200).json({
            success: true,
            message: `Coupon status changed to ${updated.isActive ? "Active" : "Inactive"}.`,
            data: updated
        });
    } catch (error) {
        console.error("Toggle coupon status error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to update coupon status."
        });
    }
};

/**
 * Delete a coupon (Admin only)
 */
const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        await couponService.deleteCoupon(id);
        return res.status(200).json({
            success: true,
            message: "Coupon deleted successfully."
        });
    } catch (error) {
        console.error("Delete coupon error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to delete coupon."
        });
    }
};

/**
 * Validate a coupon code during checkout (Authenticated Users)
 */
const validateCoupon = async (req, res) => {
    try {
        const { code, totalAmount } = req.body;
        const result = await couponService.validateCoupon({ code, totalAmount });
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Validate coupon error:", error);
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message || "Invalid coupon code."
        });
    }
};

module.exports = {
    createCoupon,
    getAllCoupons,
    toggleCouponStatus,
    deleteCoupon,
    validateCoupon
};
