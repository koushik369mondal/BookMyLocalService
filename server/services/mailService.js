const { transporter, mailConfig, verifyTransporter } = require("../config/mail");
const {
    otpTemplate,
    contactBusinessTemplate,
    contactCustomerTemplate,
    bookingConfirmationTemplate,
    welcomeTemplate
} = require("../templates");

/**
 * Generic HTTP mail sender for HTTP-based providers (Resend, Brevo, Mailgun, Custom HTTP)
 */
const sendHttpMail = async ({ to, subject, html, text, from }) => {
    const provider = (process.env.MAIL_PROVIDER || "resend").toLowerCase();
    const fromAddress = from || mailConfig.from;

    if (provider === "resend" || process.env.RESEND_API_KEY) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) throw new Error("[MailService Error] RESEND_API_KEY environment variable is required for Resend provider.");

        console.log(`[MailService HTTP] Dispatching email via Resend to: ${to}`);
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: fromAddress,
                to: [to],
                subject,
                html,
                text
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(`[Resend Error] ${data.message || JSON.stringify(data)}`);
        }
        console.log(`[MailService HTTP] Email sent successfully via Resend! ID: ${data.id}`);
        return { messageId: data.id, provider: "resend" };
    }

    if (provider === "brevo" || process.env.BREVO_API_KEY) {
        const apiKey = process.env.BREVO_API_KEY;
        if (!apiKey) throw new Error("[MailService Error] BREVO_API_KEY environment variable is required for Brevo provider.");

        console.log(`[MailService HTTP] Dispatching email via Brevo to: ${to}`);
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "api-key": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sender: { email: mailConfig.businessEmail || "noreply@bookmylocalservice.com", name: "BookMyLocalService" },
                to: [{ email: to }],
                subject,
                htmlContent: html,
                textContent: text
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(`[Brevo Error] ${data.message || JSON.stringify(data)}`);
        }
        console.log(`[MailService HTTP] Email sent successfully via Brevo! MessageID: ${data.messageId}`);
        return { messageId: data.messageId, provider: "brevo" };
    }

    throw new Error(`[MailService Error] Unsupported HTTP mail provider '${provider}'. Set RESEND_API_KEY or BREVO_API_KEY in environment variables.`);
};

/**
 * Base generic email sender using centralized Nodemailer transporter or HTTP provider fallback
 * @param {object} options - Mail configuration options (to, subject, html, text, from)
 * @returns {Promise<object>} - Nodemailer send response info
 */
const sendMail = async ({ to, subject, html, text, from }) => {
    if (!to) {
        throw new Error("[MailService Error] Recipient email address ('to') is required.");
    }

    const provider = (process.env.MAIL_PROVIDER || "smtp").toLowerCase();

    // Use HTTP provider if explicitly configured or API keys exist
    if (provider !== "smtp" || process.env.RESEND_API_KEY || process.env.BREVO_API_KEY) {
        return await sendHttpMail({ to, subject, html, text, from });
    }

    const mailOptions = {
        from: from || mailConfig.from,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>?/gm, "")
    };

    try {
        console.log(`[MailService SMTP] Dispatching email to: ${to} | Subject: "${subject}"`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`[MailService SMTP] Email successfully sent via SMTP! Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`[MailService Error] Failed sending email to ${to}:`, error.message);

        if (error.code === "ENETUNREACH") {
            console.error("[MailService Error Detail] ENETUNREACH: SMTP network connection unreachable. IPv6 connection blocked or outbound port 587 firewalled by cloud provider (Render).");
        } else if (error.code === "EAUTH") {
            console.error("[MailService Error Detail] EAUTH: Gmail SMTP authentication failed. Please verify EMAIL_USER and EMAIL_PASS (App Password) in environment variables.");
        } else if (error.code === "ETIMEDOUT" || error.code === "ESOCKET") {
            console.error(`[MailService Error Detail] ${error.code}: SMTP socket timed out while communicating with smtp.gmail.com.`);
        }

        // Automatic fallback to HTTP provider if RESEND_API_KEY or BREVO_API_KEY is configured
        if (process.env.RESEND_API_KEY || process.env.BREVO_API_KEY) {
            console.warn("[MailService Fallback] SMTP failed. Attempting HTTP API mail fallback...");
            try {
                return await sendHttpMail({ to, subject, html, text, from });
            } catch (httpError) {
                console.error("[MailService Fallback Error] HTTP mail fallback also failed:", httpError.message);
            }
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
