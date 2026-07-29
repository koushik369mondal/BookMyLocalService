const { transporter, mailConfig, verifyTransporter } = require("../config/mail");
const {
    otpTemplate,
    contactBusinessTemplate,
    contactCustomerTemplate,
    bookingConfirmationTemplate,
    welcomeTemplate
} = require("../templates");

/**
 * Base generic email sender using centralized Nodemailer transporter
 * @param {object} options - Mail configuration options (to, subject, html, text, from)
 * @returns {Promise<object>} - Nodemailer send response info
 */
const sendMail = async ({ to, subject, html, text, from }) => {
    if (!to) {
        throw new Error("[MailService Error] Recipient email address ('to') is required.");
    }

    const mailOptions = {
        from: from || mailConfig.from,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>?/gm, "")
    };

    try {
        console.log(`[MailService] Dispatching email to: ${to} | Subject: "${subject}"`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`[MailService] Email successfully sent! Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`[MailService Error] Failed sending email to ${to}:`, error);
        if (error.code === "EAUTH") {
            console.error("[MailService Error Detail] EAUTH: Gmail SMTP authentication failed. Check EMAIL_USER and EMAIL_PASS in your .env file.");
        }
        throw error;
    }
};

/**
 * Sends OTP login verification code email
 * @param {string} email - Recipient user email
 * @param {string} otp - 6-digit verification code
 * @param {string} [fullName] - Recipient user full name
 */
const sendOtpEmail = async (email, otp, fullName = "") => {
    const html = otpTemplate({ otp, fullName });
    return sendMail({
        to: email,
        subject: "BookMyLocalService Login Verification",
        html
    });
};

/**
 * Sends contact form emails:
 * 1. Inquiry notification to business admin
 * 2. Automated receipt confirmation to customer
 * @param {object} params - Contact form parameters (name, email, phone, subject, message)
 */
const sendContactFormEmails = async ({ name, email, phone, subject, message }) => {
    const businessHtml = contactBusinessTemplate({ name, email, phone, subject, message });
    const customerHtml = contactCustomerTemplate({ name, subject });

    // Send notification to business support email
    const businessResult = await sendMail({
        to: mailConfig.businessEmail,
        subject: `[Contact Form] ${subject} - From ${name}`,
        html: businessHtml
    });

    // Send confirmation receipt email to user
    const customerResult = await sendMail({
        to: email,
        subject: `Thank you for contacting BookMyLocalService - ${subject}`,
        html: customerHtml
    });

    return { businessResult, customerResult };
};

/**
 * Sends booking confirmation email to customer
 */
const sendBookingConfirmationEmail = async ({ email, customerName, bookingId, serviceName, providerName, date, time, totalAmount }) => {
    const html = bookingConfirmationTemplate({
        bookingId,
        customerName,
        serviceName,
        providerName,
        date,
        time,
        totalAmount
    });

    return sendMail({
        to: email,
        subject: `Booking Confirmed - ${bookingId}`,
        html
    });
};

/**
 * Sends welcome onboarding email to new user
 */
const sendWelcomeEmail = async ({ email, fullName, role }) => {
    const html = welcomeTemplate({ fullName, role });

    return sendMail({
        to: email,
        subject: "Welcome to BookMyLocalService!",
        html
    });
};

module.exports = {
    transporter,
    mailConfig,
    verifyTransporter,
    sendMail,
    sendOtpEmail,
    sendContactFormEmails,
    sendBookingConfirmationEmail,
    sendWelcomeEmail
};
