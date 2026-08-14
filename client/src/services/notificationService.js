import { api } from "./apiClient";

export const notificationService = {
  /**
   * Get user notifications with optional unreadOnly filter and pagination
   */
  async getNotifications(params = {}) {
    const response = await api.get("/notifications", { params });
    return response.data;
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount() {
    const response = await api.get("/notifications/unread-count");
    return response.data;
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(id) {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    const response = await api.patch("/notifications/read-all");
    return response.data;
  },

  /**
   * Delete a notification
   */
  async deleteNotification(id) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};
