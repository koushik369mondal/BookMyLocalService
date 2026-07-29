/**
 * Generates booking confirmation email HTML template
 */
const bookingConfirmationTemplate = ({ bookingId, customerName, serviceName, providerName, date, time, totalAmount }) => {
    const formattedAmount = typeof totalAmount === "number" ? `$${totalAmount.toFixed(2)}` : (totalAmount || "$0.00");
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmed - ${bookingId}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 0; color: #1F1D1A; }
        .container { max-width: 580px; margin: 30px auto; background: #FFFFFF; border: 1px solid #E8DCC3; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { background-color: #F0E7D5; padding: 28px; text-align: center; border-b: 1px solid #E8DCC3; }
        .logo { font-size: 24px; font-weight: 900; color: #1F1D1A; text-decoration: none; }
        .logo span { color: #C9A46A; }
        .content { padding: 36px 30px; color: #5A5146; line-height: 1.6; }
        .badge { display: inline-block; background-color: #7DAB7D; color: #FFFFFF; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 6px; margin-bottom: 12px; }
        h1 { font-size: 20px; font-weight: 800; color: #1F1D1A; margin-top: 0; margin-bottom: 14px; }
        p { font-size: 14px; margin-bottom: 20px; }
        .summary-card { background-color: #FAF6F0; border: 1px solid #E8DCC3; border-radius: 14px; padding: 20px; margin: 24px 0; }
        .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px border-dash #E8DCC3; font-size: 13px; }
        .summary-row:last-child { border-bottom: none; }
        .summary-label { font-weight: 700; color: #7A7266; }
        .summary-value { font-weight: 800; color: #1F1D1A; }
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
            <span class="badge">Booking Confirmed</span>
            <h1>Service Dispatch Scheduled!</h1>
            <p>Hello ${customerName || "Valued Customer"},</p>
            <p>Your local service booking has been confirmed! Here are your appointment details:</p>
            
            <div class="summary-card">
                <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px;">
                    <tr>
                        <td style="font-weight: 700; color: #7A7266;">Booking Ref:</td>
                        <td style="font-weight: 900; color: #1F1D1A; text-align: right;">${bookingId}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 700; color: #7A7266;">Service Requested:</td>
                        <td style="font-weight: 800; color: #1F1D1A; text-align: right;">${serviceName}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 700; color: #7A7266;">Assigned Specialist:</td>
                        <td style="font-weight: 800; color: #C9A46A; text-align: right;">${providerName}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 700; color: #7A7266;">Date & Time:</td>
                        <td style="font-weight: 800; color: #1F1D1A; text-align: right;">${date} at ${time}</td>
                    </tr>
                    <tr style="border-top: 1px solid #E8DCC3;">
                        <td style="font-weight: 900; color: #1F1D1A; font-size: 14px; pt: 10px;">Total Amount:</td>
                        <td style="font-weight: 900; color: #8C4B3E; font-size: 15px; text-align: right; pt: 10px;">${formattedAmount}</td>
                    </tr>
                </table>
            </div>

            <p>You can review status updates and message your service specialist anytime via your Customer Dashboard.</p>
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

module.exports = bookingConfirmationTemplate;
