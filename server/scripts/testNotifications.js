require("dotenv").config();
const prisma = require("../config/prisma");
const notificationService = require("../modules/notification/notification.service");


async function main() {
  console.log("=== Testing Notification System ===");

  // Find or create test user
  let user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found, creating test user...");
    user = await prisma.user.create({
      data: {
        fullName: "Notification Test User",
        email: `testnotif_${Date.now()}@example.com`,
        role: "CUSTOMER"
      }
    });
  }

  console.log(`Using User ID: ${user.id} (${user.fullName})`);

  // 1. Create Notifications
  const notif1 = await notificationService.createNotification({
    userId: user.id,
    type: "BOOKING_CREATED",
    title: "Booking Requested",
    message: "Your booking for Home Cleaning on 2026-08-20 at 10:00 AM has been placed.",
    referenceId: "bk_test_123",
    referenceType: "BOOKING"
  });
  console.log("Created Notification 1:", notif1.id, notif1.title);

  const notif2 = await notificationService.createNotification({
    userId: user.id,
    type: "PAYMENT_RECEIVED",
    title: "Payment Received",
    message: "Payment of ₹499 for Home Cleaning was successful.",
    referenceId: "bk_test_123",
    referenceType: "BOOKING"
  });
  console.log("Created Notification 2:", notif2.id, notif2.title);

  // 2. Fetch User Notifications
  const userNotifs = await notificationService.getUserNotifications(user.id);
  console.log(`Fetched ${userNotifs.notifications.length} notifications, Unread: ${userNotifs.unreadCount}`);

  // 3. Mark Single as Read
  const marked = await notificationService.markAsRead(notif1.id, user.id);
  console.log("Marked Notification 1 as read:", marked.isRead);

  // 4. Get Unread Count
  const count = await notificationService.getUnreadCount(user.id);
  console.log("Unread Count after marking 1 read:", count.unreadCount);

  // 5. Mark All as Read
  await notificationService.markAllAsRead(user.id);
  const countAfterAllRead = await notificationService.getUnreadCount(user.id);
  console.log("Unread Count after marking all read:", countAfterAllRead.unreadCount);

  // 6. Delete Notification
  await notificationService.deleteNotification(notif1.id, user.id);
  await notificationService.deleteNotification(notif2.id, user.id);
  console.log("Deleted test notifications successfully!");

  console.log("=== All Notification System tests PASSED! ===");
}

main()
  .catch((err) => {
    console.error("Notification test error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
