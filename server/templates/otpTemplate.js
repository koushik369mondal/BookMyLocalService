/**
 * Generates OTP verification email HTML template
 */
const otpTemplate = ({ otp, fullName }) => {
    const greeting = fullName ? `Hello ${fullName},` : "Hello,";
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BookMyLocalService - Verification Code</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 0; color: #1F1D1A; }
        .container { max-width: 580px; margin: 30px auto; background: #FFFFFF; border: 1px solid #E8DCC3; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { background-color: #F0E7D5; padding: 28px; text-align: center; border-b: 1px solid #E8DCC3; }
        .logo { font-size: 24px; font-weight: 900; color: #1F1D1A; text-decoration: none; }
        .logo span { color: #C9A46A; }
        .content { padding: 36px 30px; color: #5A5146; line-height: 1.6; }
        h1 { font-size: 20px; font-weight: 800; color: #1F1D1A; margin-top: 0; margin-bottom: 14px; }
        p { font-size: 14px; margin-bottom: 20px; }
        .otp-box { background-color: #FAF6F0; border: 1.5px dashed #C9A46A; border-radius: 14px; padding: 20px; text-align: center; margin: 26px 0; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 7px; color: #8C4B3E; margin: 0; }
        .validity { font-size: 12px; color: #7A7266; margin-top: 8px; font-weight: 600; }
        .warning-box { background-color: #FAF6F0; border-left: 4px solid #8C4B3E; padding: 14px 16px; border-radius: 8px; margin-bottom: 24px; }
        .warning-text { font-size: 12px; color: #8C4B3E; margin: 0; font-weight: 600; }
        .footer { background-color: #F0E7D5; padding: 20px 30px; text-align: center; border-top: 1px solid #E8DCC3; font-size: 12px; color: #7A7266; }
        .footer p { margin: 3px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">BookMyLocal<span>Service</span></div>
        </div>
        <div class="content">
            <h1>Login Verification Code</h1>
            <p>${greeting}</p>
            <p>We received a request to access your BookMyLocalService account. Use the 6-digit verification code below to complete your authentication:</p>
            
            <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="validity">Expires in 5 minutes</div>
            </div>
            
            <div class="warning-box">
                <p class="warning-text">🔒 <strong>Security Note:</strong> Never share this code with anyone. BookMyLocalService staff will never ask for your verification code.</p>
            </div>
            
            <p>If you did not request this code, please ignore this email.</p>
        </div>
        <div class="footer">
            <p><strong>BookMyLocalService Workspace</strong></p>
            <p>Verified Local Service Specialists Platform</p>
            <p>&copy; ${new Date().getFullYear()} BookMyLocalService. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = otpTemplate;
