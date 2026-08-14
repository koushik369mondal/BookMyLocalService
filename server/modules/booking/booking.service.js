const bookingRepository = require("./booking.repository");
const prisma = require("../../config/prisma");
const notificationService = require("../notification/notification.service");

const getProviderPlans = (category, basePrice) => {
  const basicPrice = basePrice;
  const standardPrice = Math.round(basePrice * 1.5);
  const premiumPrice = Math.round(basePrice * 2.2);

  switch (category) {
    case "Home Cleaning":
      return [
        { name: "Express Clean", price: basicPrice },
        { name: "Premium Deep Clean", price: standardPrice },
        { name: "Ultimate Move Out Package", price: premiumPrice }
      ];
    case "Plumbing":
      return [
        { name: "Diagnostic & Fix", price: basicPrice },
        { name: "Comprehensive Repair", price: standardPrice },
        { name: "Major Overhaul & Emergency", price: premiumPrice }
      ];
    case "Electrical":
      return [
        { name: "Consultation & Diagnostics", price: basicPrice },
        { name: "Smart Home Setup", price: standardPrice },
        { name: "EV Charger & Panel Upgrade", price: premiumPrice }
      ];
    case "Moving & Packing":
      return [
        { name: "Standard Moving Assistance", price: basicPrice },
        { name: "Full Packing & Move", price: standardPrice },
        { name: "Deluxe Long-Distance Service", price: premiumPrice }
      ];
    case "Lawn & Garden":
      return [
        { name: "Lawn Mowing & Edging", price: basicPrice },
        { name: "Lawn & Shrub Maintenance", price: standardPrice },
        { name: "Complete Landscaping Revamp", price: premiumPrice }
      ];
    default:
      return [
        { name: "Express Session", price: basicPrice },
        { name: "Classic Holistic Treatment", price: standardPrice },
        { name: "Ultimate Wellness Package", price: premiumPrice }
      ];
  }
};

class BookingService {
  async createBooking({ customerId, serviceId, plan, date, time }) {
    if (!serviceId) throw new Error("Service ID is required.");
    if (!plan) throw new Error("Booking plan is required.");
    if (!date) throw new Error("Booking date is required.");
    if (!time) throw new Error("Booking time slot is required.");

    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      throw new Error("Target service not found in database.");
    }

    // Determine plan price or fallback to service base price
    let basePrice = service.price;
    const categoryName = typeof service.category === "object" ? service.category?.name : service.category;
    const plans = getProviderPlans(categoryName, service.price);
    const matchedPlan = plans.find(p => p.name.toLowerCase() === plan.toLowerCase());
    if (matchedPlan) {
      basePrice = matchedPlan.price;
    }

    // Backend-calculated pricing fields (secure, ignoring untrusted client inputs)
    const platformFee = 49.00;
    const tax = Math.round(basePrice * 0.18 * 100) / 100;
    const discount = 0.0;
    const total = Math.round((basePrice + platformFee + tax - discount) * 100) / 100;

    const newBooking = await bookingRepository.create({
      customerId,
      providerId: service.providerId,
      serviceId,
      plan,
      date,
      time,
      price: basePrice,
      platformFee,
      tax,
      discount,
      total,
      bookingStatus: "PENDING",
      serviceStatus: "NOT_STARTED",
      paymentStatus: "PENDING",
      paymentMethod: "ONLINE",
      status: "pending"
    });

    // Auto-create notifications for Customer and Provider asynchronously
    try {
      await Promise.all([
        notificationService.createNotification({
          userId: customerId,
          type: "BOOKING_CREATED",
          title: "Booking Requested",
          message: `Your booking request for "${service.title}" on ${date} at ${time} has been placed.`,
          referenceId: newBooking.id,
          referenceType: "BOOKING"
        }),
        notificationService.createNotification({
          userId: service.providerId,
          type: "BOOKING_CREATED",
          title: "New Booking Request",
          message: `You have received a new booking request for "${service.title}" scheduled for ${date} at ${time}.`,
          referenceId: newBooking.id,
          referenceType: "BOOKING"
        })
      ]);
    } catch (notifErr) {
      console.error("Failed to generate booking creation notifications:", notifErr);
    }

    return newBooking;
  }

  async getBookingById(id) {
    return await bookingRepository.findById(id);
  }

  async getUserBookings(userId, role) {
    return await bookingRepository.findByUserId(userId, role);
  }

  async updateBooking(id, updateData) {
    const existing = await bookingRepository.findById(id);
    const sanitized = { ...updateData };

    if (sanitized.status) {
      const s = String(sanitized.status).toLowerCase();
      if (s === "upcoming" || s === "confirmed") {
        sanitized.bookingStatus = "CONFIRMED";
        sanitized.status = "upcoming";
      } else if (s === "completed") {
        sanitized.bookingStatus = "COMPLETED";
        sanitized.serviceStatus = "COMPLETED";
        sanitized.status = "completed";
      } else if (s === "cancelled") {
        sanitized.bookingStatus = "CANCELLED";
        sanitized.status = "cancelled";
      }
    }

    if (sanitized.paymentMethod) {
      const pm = String(sanitized.paymentMethod).toUpperCase();
      if (pm === "CASH" || pm === "CASH_ON_JOB") {
        sanitized.paymentMethod = "CASH_ON_JOB";
      } else {
        sanitized.paymentMethod = "ONLINE";
      }
    }

    if (sanitized.paymentStatus) {
      const ps = String(sanitized.paymentStatus).toUpperCase();
      if (["PENDING", "PAID", "FAILED", "REFUNDED"].includes(ps)) {
        sanitized.paymentStatus = ps;
      }
    }

    const updated = await bookingRepository.update(id, sanitized);

    // Trigger status update notifications if status changed
    try {
      if (existing) {
        const oldBStatus = (existing.bookingStatus || existing.status || "").toUpperCase();
        const newBStatus = (updated.bookingStatus || updated.status || "").toUpperCase();
        const oldPStatus = (existing.paymentStatus || "").toUpperCase();
        const newPStatus = (updated.paymentStatus || "").toUpperCase();

        const serviceTitle = updated.service?.title || "Service";

        if (oldBStatus !== newBStatus) {
          if (newBStatus === "CONFIRMED") {
            await notificationService.createNotification({
              userId: updated.customerId,
              type: "BOOKING_CONFIRMED",
              title: "Booking Confirmed",
              message: `Your booking for "${serviceTitle}" has been confirmed.`,
              referenceId: updated.id,
              referenceType: "BOOKING"
            });
          } else if (newBStatus === "CANCELLED") {
            await Promise.all([
              notificationService.createNotification({
                userId: updated.customerId,
                type: "BOOKING_CANCELLED",
                title: "Booking Cancelled",
                message: `Booking for "${serviceTitle}" has been cancelled.`,
                referenceId: updated.id,
                referenceType: "BOOKING"
              }),
              notificationService.createNotification({
                userId: updated.providerId,
                type: "BOOKING_CANCELLED",
                title: "Booking Cancelled",
                message: `Booking for "${serviceTitle}" was cancelled.`,
                referenceId: updated.id,
                referenceType: "BOOKING"
              })
            ]);
          } else if (newBStatus === "COMPLETED") {
            await Promise.all([
              notificationService.createNotification({
                userId: updated.customerId,
                type: "SERVICE_COMPLETED",
                title: "Service Completed",
                message: `Your service "${serviceTitle}" has been completed. Please rate your experience!`,
                referenceId: updated.id,
                referenceType: "BOOKING"
              }),
              notificationService.createNotification({
                userId: updated.providerId,
                type: "SERVICE_COMPLETED",
                title: "Job Completed",
                message: `Job for "${serviceTitle}" marked as completed.`,
                referenceId: updated.id,
                referenceType: "BOOKING"
              })
            ]);
          }
        }

        if (oldPStatus !== "PAID" && newPStatus === "PAID") {
          await Promise.all([
            notificationService.createNotification({
              userId: updated.customerId,
              type: "PAYMENT_RECEIVED",
              title: "Payment Successful",
              message: `Payment of ₹${updated.total} for "${serviceTitle}" was received successfully.`,
              referenceId: updated.id,
              referenceType: "BOOKING"
            }),
            notificationService.createNotification({
              userId: updated.providerId,
              type: "PAYMENT_RECEIVED",
              title: "Payment Received",
              message: `Payment of ₹${updated.total} received for job "${serviceTitle}".`,
              referenceId: updated.id,
              referenceType: "BOOKING"
            })
          ]);
        }
      }
    } catch (notifErr) {
      console.error("Failed to generate booking update notifications:", notifErr);
    }

    return updated;
  }


  async deleteBooking(id) {
    return await bookingRepository.delete(id);
  }
}

module.exports = new BookingService();
