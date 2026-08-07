import { api } from "./apiClient";

export const reviewsService = {
  createReview: async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },

  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  getCustomerReviews: async () => {
    const response = await api.get("/reviews/my-reviews");
    return response.data;
  },

  getServiceReviews: async (serviceId) => {
    const response = await api.get(`/reviews/service/${serviceId}`);
    return response.data;
  },

  getTestimonials: async () => {
    const response = await api.get("/reviews/testimonials");
    return response.data;
  },

  replyToReview: async (id, reply) => {
    const response = await api.patch(`/reviews/${id}/reply`, { reply });
    return response.data;
  }
};
