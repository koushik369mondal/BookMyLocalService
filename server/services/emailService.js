require("dotenv").config();
const nodemailer = require("nodemailer");

// Create transport configuration using Gmail SMTP settings
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends a secure OTP login verification email to the user
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit verification code
 * @returns {Promise<object>} - Nodemailer send response
 */
const sendOtpEmail = async (email, otp) => {
    // 11. Test transporter.verify() before sending the OTP
    try {
        console.log("[SMTP] Testing SMTP connection to Gmail...");
        await transporter.verify();
        console.log("[SMTP] SMTP connection successfully verified!");
    } catch (verifyError) {
        console.error("[SMTP] SMTP verification failed. Complete Error details:", verifyError);
        if (verifyError.code === 'EAUTH') {
            console.error("[SMTP Error Explanation] EAUTH: Authentication failed. This usually indicates that the EMAIL_USER is incorrect or the EMAIL_PASS is not a valid Gmail App Password.");
        }
        throw verifyError;
    }

    const mailOptions = {
        from: `"BookMyLocalService" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "BookMyLocalService Login Verification",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BookMyLocalService Login Verification</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background-color: #F8FAFC;
                    margin: 0;
                    padding: 0;
                    -webkit-font-smoothing: antialiased;
                }
                .container {
                    max-width: 580px;
                    margin: 30px auto;
                    background: #FFFFFF;
                    border: 1px solid #E2E8F0;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                }
                .header {
                    background-color: #0F172A;
                    padding: 30px;
                    text-align: center;
                }
                .logo {
                    font-size: 24px;
                    font-weight: 800;
                    color: #FFFFFF;
                    letter-spacing: -0.5px;
                    text-decoration: none;
                }
                .logo span {
                    color: #F59E0B;
                }
                .content {
                    padding: 40px 30px;
                    color: #334155;
                    line-height: 1.6;
                }
                h1 {
                    font-size: 22px;
                    font-weight: 700;
                    color: #0F172A;
                    margin-top: 0;
                    margin-bottom: 16px;
                }
                p {
                    font-size: 15px;
                    margin-bottom: 24px;
                }
                .otp-container {
                    background-color: #F1F5F9;
                    border: 1px solid #E2E8F0;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    margin: 30px 0;
                }
                .otp-code {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 32px;
                    font-weight: 800;
                    letter-spacing: 6px;
                    color: #0F172A;
                    margin: 0;
                }
                .validity {
                    font-size: 13px;
                    color: #64748B;
                    margin-top: 8px;
                    font-weight: 600;
                }
                .warning-box {
                    background-color: #FFFBEB;
                    border-left: 4px solid #F59E0B;
                    padding: 15px;
                    border-radius: 4px;
                    margin-bottom: 30px;
                }
                .warning-text {
                    font-size: 13px;
                    color: #B45309;
                    margin: 0;
                    font-weight: 500;
                }
                .footer {
                    background-color: #F8FAFC;
                    padding: 24px 30px;
                    text-align: center;
                    border-top: 1px solid #E2E8F0;
                    font-size: 12px;
                    color: #64748B;
                }
                .footer p {
                    margin: 4px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">BookMyLocal<span>Service</span></div>
                </div>
                <div class="content">
                    <h1>Verify Your Login</h1>
                    <p>Hello,</p>
                    <p>We received a request to log into your BookMyLocalService account. Use the verification code below to complete your login:</p>
                    
                    <div class="otp-container">
                        <div class="otp-code">${otp}</div>
                        <div class="validity">Valid for 5 minutes</div>
                    </div>
                    
                    <div class="warning-box">
                        <p class="warning-text">⚠️ <strong>Security Warning:</strong> For your security, never share this code with anyone. BookMyLocalService representatives will never ask you for this verification code.</p>
                    </div>
                    
                    <p>If you did not request this login code, please ignore this email or contact support if you have concerns.</p>
                </div>
                <div class="footer">
                    <p><strong>BookMyLocalService</strong></p>
                    <p>Find and Book Verified Local Service Specialists</p>
                    <p>&copy; 2026 BookMyLocalService. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("[SMTP] OTP Email sent successfully! Message ID:", info.messageId);
        return info;
    } catch (sendError) {
        console.error("[SMTP] Failed to send OTP Email. Complete Nodemailer Error:", sendError);

        if (sendError.code === 'EAUTH') {
            console.error("[SMTP Error Explanation] EAUTH: Gmail SMTP authentication failed. Check that EMAIL_USER matches your Gmail address and EMAIL_PASS is a valid 16-character App Password (not your regular account password). App Passwords require 2-Step Verification to be enabled on your Google Account.");
        } else {
            console.error("[SMTP Error Explanation] An unexpected SMTP error occurred. Please verify your internet connection, port, and security settings.");
        }

        throw sendError;
    }
};

module.exports = {
    sendOtpEmail
};
