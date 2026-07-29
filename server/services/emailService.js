/**
 * Email Service facade delegating to centralized mailService
 */
const mailService = require("./mailService");

module.exports = {
    sendOtpEmail: mailService.sendOtpEmail,
    sendMail: mailService.sendMail,
    sendContactFormEmails: mailService.sendContactFormEmails,
    sendBookingConfirmationEmail: mailService.sendBookingConfirmationEmail,
    sendWelcomeEmail: mailService.sendWelcomeEmail
};
