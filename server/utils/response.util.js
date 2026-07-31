/**
 * Centralized mail and server error response handler.
 * @param {object} res - Express response object
 * @param {Error} error - Error instance
 * @param {string} actionName - Context action description
 */
const handleMailOrServerError = (res, error, actionName = "sending OTP") => {
    console.error(`[${actionName} Error Detail]:`, error);

    if (error.code === "INVALID_RECIPIENT") {
        return res.status(400).json({
            success: false,
            message: "Invalid email address format."
        });
    }

    if (
        error.code === "EAUTH" ||
        error.code === "ESOCKET" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNECTION" ||
        error.code === "ENETUNREACH" ||
        error.code === "ENOTFOUND"
    ) {
        return res.status(503).json({
            success: false,
            message: "Email delivery service is currently unavailable. Please try again later or contact support.",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }

    return res.status(500).json({
        success: false,
        message: `Server error during ${actionName}`,
        error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
};

module.exports = {
    handleMailOrServerError
};
