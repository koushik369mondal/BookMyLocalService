const crypto = require("crypto");

/**
 * Generate a random numeric OTP code of given length.
 */
const generateOtpCode = (length = 6) => {
    const digits = "0123456789";
    let otp = "";
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        otp += digits[randomBytes[i] % digits.length];
    }
    return otp;
};

/**
 * Hash an OTP code using SHA-256 for secure DB storage.
 */
const hashOtp = (otp) => {
    return crypto.createHash("sha256").update(otp.toString()).digest("hex");
};

/**
 * Verify plaintext OTP code against stored SHA-256 hash.
 */
const verifyOtpCode = (otp, hashedOtp) => {
    if (!otp || !hashedOtp) return false;
    const computedHash = hashOtp(otp);
    return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(hashedOtp));
};

/**
 * Check rate limit (1 minute cooldown between resend requests).
 */
const checkRateLimit = (lastOtpExpiresAt) => {
    if (!lastOtpExpiresAt) return { isRateLimited: false, secondsToWait: 0 };
    const createdAt = new Date(lastOtpExpiresAt.getTime() - 5 * 60 * 1000);
    const elapsedMs = Date.now() - createdAt.getTime();
    const cooldownMs = 60 * 1000;
    if (elapsedMs < cooldownMs) {
        const secondsToWait = Math.ceil((cooldownMs - elapsedMs) / 1000);
        return { isRateLimited: true, secondsToWait };
    }
    return { isRateLimited: false, secondsToWait: 0 };
};

/**
 * Validate user OTP expiration and attempt counts.
 */
const validateOtpState = (user) => {
    if (!user || !user.otpHash || !user.otpExpiresAt) {
        return { valid: false, reason: "No active OTP request found. Please request a new OTP." };
    }
    if (user.otpAttempts >= 5) {
        return { valid: false, reason: "Too many failed attempts. Please request a new OTP." };
    }
    if (new Date() > new Date(user.otpExpiresAt)) {
        return { valid: false, reason: "OTP code has expired. Please request a new OTP." };
    }
    return { valid: true };
};

module.exports = {
    generateOtpCode,
    hashOtp,
    verifyOtpCode,
    checkRateLimit,
    validateOtpState
};
