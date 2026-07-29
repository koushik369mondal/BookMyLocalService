/**
 * Generates automated customer confirmation receipt email HTML template
 */
const contactCustomerTemplate = ({ name, subject }) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Contacting BookMyLocalService</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 0; color: #1F1D1A; }
        .container { max-width: 580px; margin: 30px auto; background: #FFFFFF; border: 1px solid #E8DCC3; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { background-color: #F0E7D5; padding: 28px; text-align: center; border-b: 1px solid #E8DCC3; }
        .logo { font-size: 24px; font-weight: 900; color: #1F1D1A; text-decoration: none; }
        .logo span { color: #C9A46A; }
        .content { padding: 36px 30px; color: #5A5146; line-height: 1.6; }
        h1 { font-size: 20px; font-weight: 800; color: #1F1D1A; margin-top: 0; margin-bottom: 14px; }
        p { font-size: 14px; margin-bottom: 20px; }
        .status-box { background-color: #FAF6F0; border: 1px solid #E8DCC3; border-radius: 12px; padding: 18px 20px; margin: 24px 0; }
        .status-title { font-size: 13px; font-weight: 800; color: #1F1D1A; margin-bottom: 4px; }
        .status-desc { font-size: 12px; color: #7A7266; margin: 0; }
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
            <h1>We Received Your Message!</h1>
            <p>Hello ${name},</p>
            <p>Thank you for reaching out to BookMyLocalService. We have received your inquiry regarding <strong>"${subject}"</strong>.</p>
            
            <div class="status-box">
                <div class="status-title">✅ Inquiry Logged</div>
                <div class="status-desc">Our support team is reviewing your message and will respond to you within 24 business hours.</div>
            </div>

            <p>If your request requires urgent booking assistance, you can also manage active bookings or dispatch requests directly from your account dashboard.</p>
            
            <p>Best regards,<br><strong>BookMyLocalService Support Team</strong></p>
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

module.exports = contactCustomerTemplate;
