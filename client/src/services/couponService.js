import { api } from "./apiClient";

export const couponService = {
    getAllCoupons: async (params = {}) => {
        const response = await api.get("/admin/coupons", { params });
        return response.data;
    },

    createCoupon: async (couponData) => {
        const response = await api.post("/admin/coupons", couponData);
        return response.data;
    },

    toggleCouponStatus: async (id) => {
        const response = await api.patch(`/admin/coupons/${id}/toggle`);
        return response.data;
    },

    deleteCoupon: async (id) => {
        const response = await api.delete(`/admin/coupons/${id}`);
        return response.data;
    },

    validateCoupon: async (code, totalAmount) => {
        const response = await api.post("/coupons/validate", { code, totalAmount });
        return response.data;
    }
};
