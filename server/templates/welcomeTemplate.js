/**
 * Generates welcome email HTML template for new users
 */
const welcomeTemplate = ({ fullName, role }) => {
    const roleLabel = role === "PROVIDER" ? "Service Provider" : "Customer";
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to BookMyLocalService</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 0; color: #1F1D1A; }
        .container { max-width: 580px; margin: 30px auto; background: #FFFFFF; border: 1px solid #E8DCC3; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { background-color: #F0E7D5; padding: 28px; text-align: center; border-b: 1px solid #E8DCC3; }
        .logo { font-size: 24px; font-weight: 900; color: #1F1D1A; text-decoration: none; }
        .logo span { color: #C9A46A; }
        .content { padding: 36px 30px; color: #5A5146; line-height: 1.6; }
        h1 { font-size: 22px; font-weight: 800; color: #1F1D1A; margin-top: 0; margin-bottom: 14px; }
        p { font-size: 14px; margin-bottom: 20px; }
        .welcome-card { background-color: #FAF6F0; border: 1px solid #E8DCC3; border-radius: 14px; padding: 20px; margin: 24px 0; }
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
            <h1>Welcome to BookMyLocalService!</h1>
            <p>Hello ${fullName || "there"},</p>
            <p>Welcome to the BookMyLocalService platform. Your account has been registered as a <strong>${roleLabel}</strong>.</p>
            
            <div class="welcome-card">
                <p style="font-weight: 800; color: #1F1D1A; margin-top: 0; margin-bottom: 8px;">What's Next?</p>
                ${role === "PROVIDER" ? `
                <p style="font-size: 13px; margin: 0;">Set up your provider catalog, configure your weekly availability schedule, and start receiving service dispatch requests directly from your Provider Dashboard.</p>
                ` : `
                <p style="font-size: 13px; margin: 0;">Browse top-rated local specialists in cleaning, plumbing, electrical, and lawn care. Book verified service professionals with clear upfront pricing.</p>
                `}
            </div>

            <p>If you have any questions or need assistance, feel free to reach out to our support team through our contact portal.</p>
        </div>
        <div class="footer">
            <p><strong>BookMyLocalService</strong></p>
            <p>Find & Book Verified Local Service Specialists</p>
            <p>&copy; ${new Date().getFullYear()} BookMyLocalService. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = welcomeTemplate;
