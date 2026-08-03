import { api } from "./apiClient";

export const checkoutService = {
    getCheckoutDetails: async (bookingId) => {
        const response = await api.get(`/checkout/${bookingId}`);
        return response.data;
    },

    submitCheckout: async (checkoutData) => {
        const response = await api.post("/checkout/submit", checkoutData);
        return response.data;
    },

    processPayment: async (paymentData) => {
        const response = await api.post("/checkout/pay", paymentData);
        return response.data;
    }
};
