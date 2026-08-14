const prisma = require("../../config/prisma");

class NotificationService {
  /**
   * Helper to ensure prisma.notification is available
   */
  _checkModel() {
    if (!prisma.notification) {
      throw new Error("Prisma Notification model is not initialized. Please restart the server.");
    }
  }

  /**
   * Create a new database notification
   */
  async createNotification({ userId, type, title, message, referenceId = null, referenceType = null }) {
    if (!userId || !type || !title || !message) {
      throw new Error("Missing required parameters for notification creation.");
    }

    if (!prisma.notification) {
      console.warn("[NOTIFICATION SERVICE] prisma.notification not available yet.");
      return null;
    }

    return await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        referenceId: referenceId ? String(referenceId) : null,
        referenceType: referenceType ? String(referenceType) : null,
        isRead: false
      }
    });
  }

  /**
   * Fetch paginated/filtered notifications for a specific user
   */
  async getUserNotifications(userId, { unreadOnly = false, page = 1, limit = 50 } = {}) {
    if (!prisma.notification) {
      console.warn("[NOTIFICATION SERVICE] prisma.notification not available yet.");
      return { notifications: [], total: 0, unreadCount: 0, page: 1, totalPages: 1 };
    }

    const where = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } })
    ]);

    return {
      notifications,
      total,
      unreadCount,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1
    };
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId) {
    if (!prisma.notification) {
      return { unreadCount: 0 };
    }
    const count = await prisma.notification.count({
      where: { userId, isRead: false }
    });
    return { unreadCount: count };
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId, userId) {
    if (!prisma.notification) return null;
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found or unauthorized.");
    }

    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    if (!prisma.notification) return { success: true, message: "All notifications marked as read." };
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });

    return { success: true, message: "All notifications marked as read." };
  }

  /**
   * Delete a single notification
   */
  async deleteNotification(notificationId, userId) {
    if (!prisma.notification) return { success: true, message: "Notification deleted." };
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found or unauthorized.");
    }

    await prisma.notification.delete({
      where: { id: notificationId }
    });

    return { success: true, message: "Notification deleted successfully." };
  }
}


module.exports = new NotificationService();
