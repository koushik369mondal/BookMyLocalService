const bookingService = require("../booking/booking.service");

class PaymentService {
    async getCheckoutDetails(bookingId) {
        return await bookingService.getBookingById(bookingId);
    }
    
    async updateCheckoutDetails(bookingId, updateData) {
        return await bookingService.updateBooking(bookingId, updateData);
    }
}

module.exports = new PaymentService();
