/**
 * Generates email notification sent to business admin when contact form is submitted
 */
const contactBusinessTemplate = ({ name, email, phone, subject, message }) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Us Message Received</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 0; color: #1F1D1A; }
        .container { max-width: 580px; margin: 30px auto; background: #FFFFFF; border: 1px solid #E8DCC3; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { background-color: #F0E7D5; padding: 24px; text-align: center; border-b: 1px solid #E8DCC3; }
        .logo { font-size: 22px; font-weight: 900; color: #1F1D1A; text-decoration: none; }
        .logo span { color: #C9A46A; }
        .content { padding: 32px 28px; color: #5A5146; line-height: 1.6; }
        .badge { display: inline-block; background-color: #C9A46A; color: #FFFFFF; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 6px; margin-bottom: 12px; }
        h1 { font-size: 20px; font-weight: 800; color: #1F1D1A; margin-top: 0; margin-bottom: 16px; }
        .detail-table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #FAF6F0; border-radius: 12px; overflow: hidden; border: 1px solid #E8DCC3; }
        .detail-table td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid #E8DCC3; }
        .detail-table tr:last-child td { border-bottom: none; }
        .label { font-weight: 800; color: #1F1D1A; width: 30%; }
        .value { color: #5A5146; }
        .message-box { background-color: #FFFFFF; border: 1px solid #E8DCC3; border-radius: 10px; padding: 16px; font-size: 13px; color: #1F1D1A; margin-top: 6px; white-space: pre-wrap; word-break: break-word; }
        .footer { background-color: #F0E7D5; padding: 20px 30px; text-align: center; border-top: 1px solid #E8DCC3; font-size: 12px; color: #7A7266; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">BookMyLocal<span>Service</span></div>
        </div>
        <div class="content">
            <span class="badge">New Contact Inquiry</span>
            <h1>Inquiry Received via Contact Form</h1>
            <p>A new customer message has been submitted through the BookMyLocalService website contact portal.</p>
            
            <table class="detail-table">
                <tr>
                    <td class="label">Sender Name:</td>
                    <td class="value"><strong>${name}</strong></td>
                </tr>
                <tr>
                    <td class="label">Email Address:</td>
                    <td class="value"><a href="mailto:${email}" style="color: #8C4B3E; font-weight: 700; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                    <td class="label">Phone Number:</td>
                    <td class="value">${phone || "Not provided"}</td>
                </tr>
                <tr>
                    <td class="label">Subject Topic:</td>
                    <td class="value"><strong>${subject}</strong></td>
                </tr>
            </table>

            <p style="font-weight: 800; color: #1F1D1A; margin-bottom: 6px;">Customer Message:</p>
            <div class="message-box">${message}</div>
        </div>
        <div class="footer">
            <p><strong>BookMyLocalService Support Operations</strong></p>
            <p>Automated Business Dispatch System</p>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = contactBusinessTemplate;
