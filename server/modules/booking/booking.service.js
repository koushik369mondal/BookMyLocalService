const bookingRepository = require("./booking.repository");
const prisma = require("../../config/prisma");

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

    return await bookingRepository.create({
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
      status: "pending",
      paymentStatus: "pending"
    });
  }

  async getBookingById(id) {
    return await bookingRepository.findById(id);
  }

  async getUserBookings(userId, role) {
    return await bookingRepository.findByUserId(userId, role);
  }

  async updateBooking(id, updateData) {
    return await bookingRepository.update(id, updateData);
  }

  async deleteBooking(id) {
    return await bookingRepository.delete(id);
  }
}

module.exports = new BookingService();
