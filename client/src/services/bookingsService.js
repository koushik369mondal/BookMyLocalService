import { api } from "./apiClient";

export const bookingsService = {
    getBookings: async () => {
        const response = await api.get("/bookings");
        return response.data;
    },

    getBookingById: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    createBooking: async (bookingData) => {
        const response = await api.post("/bookings", bookingData);
        return response.data;
    },

    updateBooking: async (id, bookingData) => {
        const response = await api.put(`/bookings/${id}`, bookingData);
        return response.data;
    },

    deleteBooking: async (id) => {
        const response = await api.delete(`/bookings/${id}`);
        return response.data;
    }
};
