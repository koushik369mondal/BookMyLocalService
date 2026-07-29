require("dotenv").config();
const nodemailer = require("nodemailer");

// Create reusable Nodemailer transport using SMTP credentials from environment
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailConfig = {
    from: process.env.EMAIL_FROM || `"BookMyLocalService" <${process.env.EMAIL_USER}>`,
    businessEmail: process.env.BUSINESS_EMAIL || process.env.EMAIL_USER
};

/**
 * Verifies active SMTP connection status
 */
const verifyTransporter = async () => {
    try {
        console.log("[SMTP Config] Testing connection to SMTP server...");
        await transporter.verify();
        console.log("[SMTP Config] Connection verified successfully.");
        return true;
    } catch (error) {
        console.error("[SMTP Config Error] Transporter verification failed:", error);
        return false;
    }
};

module.exports = {
    transporter,
    mailConfig,
    verifyTransporter
};
