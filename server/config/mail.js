require("dotenv").config();
const nodemailer = require("nodemailer");

const emailUser = process.env.EMAIL_USER;
const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

if (!emailUser || !emailPass) {
    console.warn("[SMTP Config Warning] EMAIL_USER or EMAIL_PASS environment variables are missing or empty.");
} else {
    console.log(`[SMTP Config] Initialized Nodemailer transport for user: ${emailUser}`);
}

// Create reusable Nodemailer transport using SMTP credentials from environment
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: emailUser,
        pass: emailPass
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
});

const mailConfig = {
    from: process.env.EMAIL_FROM || `"BookMyLocalService" <${emailUser}>`,
    businessEmail: process.env.BUSINESS_EMAIL || emailUser
};

/**
 * Verifies active SMTP connection status
 */
const verifyTransporter = async () => {
    if (!emailUser || !emailPass) {
        console.error("[SMTP Config Error] Transporter verification failed: EMAIL_USER or EMAIL_PASS environment variable is missing.");
        return false;
    }
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

