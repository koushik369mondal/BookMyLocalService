require("dotenv").config();
const nodemailer = require("nodemailer");

const emailUser = process.env.EMAIL_USER;
const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

if (!emailUser || !emailPass) {
    console.warn("[SMTP Config Warning] EMAIL_USER or EMAIL_PASS environment variables are missing or empty.");
} else {
    console.log(`[SMTP Config] Initialized Nodemailer transport for user: ${emailUser}`);
}

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
const smtpSecure = process.env.SMTP_SECURE === "true" ? true : false; // false for port 587 (STARTTLS)

const transportOptions = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    family: 4, // Force IPv4 to avoid ENETUNREACH IPv6 routing issues on cloud providers (e.g., Render)
    auth: {
        user: emailUser,
        pass: emailPass
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
        rejectUnauthorized: false
    }
};

// Create reusable Nodemailer transport
const transporter = nodemailer.createTransport(transportOptions);

const mailConfig = {
    from: process.env.EMAIL_FROM || `"BookMyLocalService" <${emailUser || "noreply@bookmylocalservice.com"}>`,
    businessEmail: process.env.BUSINESS_EMAIL || emailUser,
    provider: process.env.MAIL_PROVIDER || "smtp" // "smtp" | "resend" | "brevo" | "mailgun"
};

/**
 * Verifies active SMTP connection status with detailed diagnostic logs
 */
const verifyTransporter = async () => {
    if (!emailUser || !emailPass) {
        console.error("[SMTP Config Error] Transporter verification failed: EMAIL_USER or EMAIL_PASS environment variable is missing.");
        return false;
    }
    try {
        console.log(`[SMTP Config] Testing SMTP connection to ${smtpHost}:${smtpPort} (IPv4 family: 4, secure: ${smtpSecure})...`);
        await transporter.verify();
        console.log(`[SMTP Config] Connection to ${smtpHost}:${smtpPort} verified successfully!`);
        return true;
    } catch (error) {
        console.error(`[SMTP Config Error] Transporter verification failed for ${smtpHost}:${smtpPort}:`, error.message);
        if (error.code === "ENETUNREACH") {
            console.error("[SMTP Config Error Detail] ENETUNREACH: Network unreachable. IPv6 connection was blocked or port is firewalled on host environment.");
        } else if (error.code === "EAUTH") {
            console.error("[SMTP Config Error Detail] EAUTH: Invalid SMTP credentials. Verify EMAIL_USER and EMAIL_PASS (App Password) in environment variables.");
        } else if (error.code === "ETIMEDOUT" || error.code === "ESOCKET") {
            console.error(`[SMTP Config Error Detail] ${error.code}: Connection timed out. Host environment may be blocking outbound port ${smtpPort}.`);
        }
        return false;
    }
};

module.exports = {
    transporter,
    mailConfig,
    verifyTransporter,
    transportOptions
};


