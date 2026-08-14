const notificationService = require("./notification.service");

/**
 * Get all notifications for authenticated user
 */
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { unreadOnly, page, limit } = req.query;

    const data = await notificationService.getUserNotifications(userId, {
      unreadOnly: unreadOnly === "true",
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Error in getNotifications controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve notifications."
    });
  }
};

/**
 * Get unread notification count
 */
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await notificationService.getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Error in getUnreadCount controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve unread notification count."
    });
  }
};

/**
 * Mark notification as read
 */
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await notificationService.markAsRead(id, userId);

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: notification
    });
  } catch (error) {
    console.error("Error in markAsRead controller:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to mark notification as read."
    });
  }
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await notificationService.markAllAsRead(userId);

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error("Error in markAllAsRead controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to mark all notifications as read."
    });
  }
};

/**
 * Delete a notification
 */
const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await notificationService.deleteNotification(id, userId);

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error("Error in deleteNotification controller:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete notification."
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
