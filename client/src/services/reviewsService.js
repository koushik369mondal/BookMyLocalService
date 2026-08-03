import { api } from "./apiClient";

export const reviewsService = {
  createReview: async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },

  getServiceReviews: async (serviceId) => {
    const response = await api.get(`/reviews/service/${serviceId}`);
    return response.data;
  }
};
