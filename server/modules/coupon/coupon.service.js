const couponRepository = require("./coupon.repository");

class CouponService {
    /**
     * Create a new coupon code
     */
    async createCoupon(data) {
        const {
            code,
            description,
            discountType = "FIXED",
            discountValue,
            minOrderAmount = 0,
            maxDiscount,
            usageLimit,
            expiresAt
        } = data;

        if (!code || String(code).trim().length === 0) {
            const err = new Error("Coupon code is required");
            err.statusCode = 400;
            throw err;
        }

        const cleanCode = String(code).trim().toUpperCase();

        const existing = await couponRepository.findByCode(cleanCode);
        if (existing) {
            const err = new Error(`Coupon code '${cleanCode}' already exists`);
            err.statusCode = 400;
            throw err;
        }

        const val = parseFloat(discountValue);
        if (isNaN(val) || val <= 0) {
            const err = new Error("Discount value must be a positive number");
            err.statusCode = 400;
            throw err;
        }

        if (discountType === "PERCENTAGE" && val > 100) {
            const err = new Error("Percentage discount value cannot exceed 100%");
            err.statusCode = 400;
            throw err;
        }

        const couponData = {
            code: cleanCode,
            description: description ? String(description).trim() : null,
            discountType: discountType.toUpperCase() === "PERCENTAGE" ? "PERCENTAGE" : "FIXED",
            discountValue: val,
            minOrderAmount: Math.max(0, parseFloat(minOrderAmount) || 0),
            maxDiscount: maxDiscount ? Math.max(0, parseFloat(maxDiscount)) : null,
            usageLimit: usageLimit ? Math.max(1, parseInt(usageLimit, 10)) : null,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            isActive: true
        };

        return await couponRepository.create(couponData);
    }

    /**
     * Get all coupons for Admin directory with optional search filter
     */
    async getAllCoupons(search = "") {
        const where = {};
        if (search && String(search).trim() !== "") {
            const q = String(search).trim();
            where.OR = [
                { code: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } }
            ];
        }
        return await couponRepository.findAll(where);
    }

    /**
     * Toggle coupon active/inactive status
     */
    async toggleCouponStatus(id) {
        const coupon = await couponRepository.findById(id);
        if (!coupon) {
            const err = new Error("Coupon not found");
            err.statusCode = 404;
            throw err;
        }
        return await couponRepository.update(id, {
            isActive: !coupon.isActive
        });
    }

    /**
     * Delete a coupon record
     */
    async deleteCoupon(id) {
        const coupon = await couponRepository.findById(id);
        if (!coupon) {
            const err = new Error("Coupon not found");
            err.statusCode = 404;
            throw err;
        }
        return await couponRepository.delete(id);
    }

    /**
     * Validate a coupon code for customer checkout
     */
    async validateCoupon({ code, totalAmount = 0 }) {
        if (!code || String(code).trim().length === 0) {
            const err = new Error("Please enter a coupon code");
            err.statusCode = 400;
            throw err;
        }

        const cleanCode = String(code).trim().toUpperCase();
        const coupon = await couponRepository.findByCode(cleanCode);

        if (!coupon) {
            // Fallback for default codes if not in DB yet
            if (cleanCode === "WELCOME10" || cleanCode === "LOCAL10") {
                return {
                    valid: true,
                    code: cleanCode,
                    discountType: "FIXED",
                    discountValue: 10.00,
                    discountAmount: 10.00,
                    message: `Coupon '${cleanCode}' applied! You saved ₹10.00.`
                };
            } else if (cleanCode === "SAVE20") {
                return {
                    valid: true,
                    code: cleanCode,
                    discountType: "FIXED",
                    discountValue: 20.00,
                    discountAmount: 20.00,
                    message: `Coupon '${cleanCode}' applied! You saved ₹20.00.`
                };
            }

            const err = new Error(`Invalid promo code '${cleanCode}'`);
            err.statusCode = 400;
            throw err;
        }

        if (!coupon.isActive) {
            const err = new Error(`Coupon '${cleanCode}' is currently inactive`);
            err.statusCode = 400;
            throw err;
        }

        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
            const err = new Error(`Coupon '${cleanCode}' has expired`);
            err.statusCode = 400;
            throw err;
        }

        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            const err = new Error(`Coupon '${cleanCode}' has reached its maximum usage limit`);
            err.statusCode = 400;
            throw err;
        }

        const orderTotal = parseFloat(totalAmount) || 0;
        if (coupon.minOrderAmount > 0 && orderTotal < coupon.minOrderAmount) {
            const err = new Error(`Coupon '${cleanCode}' requires a minimum order of ₹${coupon.minOrderAmount.toFixed(2)}`);
            err.statusCode = 400;
            throw err;
        }

        let calculatedDiscount = 0;
        if (coupon.discountType === "PERCENTAGE") {
            calculatedDiscount = (orderTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && calculatedDiscount > coupon.maxDiscount) {
                calculatedDiscount = coupon.maxDiscount;
            }
        } else {
            calculatedDiscount = coupon.discountValue;
        }

        calculatedDiscount = Math.round(calculatedDiscount * 100) / 100;

        return {
            valid: true,
            id: coupon.id,
            code: coupon.code,
            description: coupon.description,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount: calculatedDiscount,
            message: `Coupon '${coupon.code}' applied! Saved ₹${calculatedDiscount.toFixed(2)}.`
        };
    }
}

module.exports = new CouponService();
