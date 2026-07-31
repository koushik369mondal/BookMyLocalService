/**
 * @desc    Submit Contact Us message
 * @route   POST /api/contact
 * @access  Public
 */
const submitContactMessage = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields (name, email, subject, and message)."
            });
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address."
            });
        }

        console.log(`[Contact Form Received] From: ${name} <${email}> (${phone || 'No phone'}), Subject: ${subject}`);
        console.log(`[Message]: ${message}`);

        return res.status(200).json({
            success: true,
            message: "Your message has been received! Our support team will get back to you shortly."
        });

    } catch (error) {
        console.error("[Contact Controller Error] Failed to process contact message:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send contact message. Please try again later."
        });
    }
};

module.exports = {
    submitContactMessage
};
