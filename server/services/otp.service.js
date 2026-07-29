const crypto = require("crypto");
const prisma = require("../config/prisma");
const {
    OTP_EXPIRE_MS,
    OTP_RATE_LIMIT_MS,
    OTP_MAX_ATTEMPTS
} = require("../constants/auth.constants");

/**
 * Generate a random 6-digit numeric OTP string.
 * @returns {string}
 */
const generateOtpCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash an OTP string using Node.js native crypto (SHA-256).
 * @param {string} otp
 * @returns {string} SHA-256 hex digest
 */
const hashOtp = (otp) => {
    return crypto.createHash("sha256").update(otp).digest("hex");
};

/**
 * Verify plaintext OTP against stored SHA-256 hash using timingSafeEqual.
 * @param {string} otp
 * @param {string} hash
 * @returns {boolean}
 */
const verifyOtpHash = (otp, hash) => {
    if (!otp || !hash) return false;
    const computedHash = hashOtp(otp);
    const bufA = Buffer.from(computedHash, "hex");
    const bufB = Buffer.from(hash, "hex");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
};

/**
 * Alias for verifyOtpHash
 */
const verifyOtpCode = (otp, hash) => {
    return verifyOtpHash(otp, hash);
};

/**
 * Check if a new OTP request exceeds the rate limit (1 request per 60 seconds).
 * @param {Date|null} otpExpiresAt
 * @returns {{ isRateLimited: boolean, secondsToWait: number }}
 */
const checkRateLimit = (otpExpiresAt) => {
    if (!otpExpiresAt || !(otpExpiresAt instanceof Date) || isNaN(otpExpiresAt.getTime())) {
        return { isRateLimited: false, secondsToWait: 0 };
    }

    const timeUntilExpiry = otpExpiresAt.getTime() - Date.now();
    const timeSinceLastSent = OTP_EXPIRE_MS - timeUntilExpiry;

    if (timeSinceLastSent > 0 && timeSinceLastSent < OTP_RATE_LIMIT_MS) {
        const secondsToWait = Math.ceil((OTP_RATE_LIMIT_MS - timeSinceLastSent) / 1000);
        return { isRateLimited: true, secondsToWait };
    }

    return { isRateLimited: false, secondsToWait: 0 };
};

/**
 * Check if an OTP has expired.
 * @param {Date|null} otpExpiresAt
 * @returns {boolean}
 */
const isOtpExpired = (otpExpiresAt) => {
    if (!otpExpiresAt || !(otpExpiresAt instanceof Date)) return true;
    return otpExpiresAt.getTime() < Date.now();
};

/**
 * Validate user's current OTP state (presence, attempt limits, expiration).
 * @param {object} user
 * @returns {{ valid: boolean, reason?: string }}
 */
const validateOtpState = (user) => {
    if (!user || !user.otpHash || !user.otpExpiresAt) {
        return { valid: false, reason: "No OTP was requested for this account." };
    }
    if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
        return { valid: false, reason: "Maximum OTP attempts exceeded. Please request a new OTP." };
    }
    if (isOtpExpired(user.otpExpiresAt)) {
        return { valid: false, reason: "OTP has expired. Please request a new OTP." };
    }
    return { valid: true };
};

/**
 * Store a new OTP hash and expiration time for a user.
 * @param {string} userId
 * @param {string} otpHash
 * @returns {Promise<object>}
 */
const storeOtp = async (userId, otpHash) => {
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRE_MS);
    return await prisma.user.update({
        where: { id: userId },
        data: {
            otpHash,
            otpExpiresAt,
            otpAttempts: 0
        }
    });
};

/**
 * Clear all OTP verification state from a user record.
 * @param {string} userId
 * @returns {Promise<object>}
 */
const clearOtp = async (userId) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            otpHash: null,
            otpExpiresAt: null,
            otpAttempts: 0
        }
    });
};

/**
 * Increment failed OTP attempt counter. If max attempts reached, clear OTP state.
 * @param {string} userId
 * @param {number} currentAttempts
 * @returns {Promise<{ isLockedOut: boolean, remainingAttempts: number }>}
 */
const incrementOtpAttempts = async (userId, currentAttempts) => {
    const newAttempts = currentAttempts + 1;
    if (newAttempts >= OTP_MAX_ATTEMPTS) {
        await clearOtp(userId);
        return { isLockedOut: true, remainingAttempts: 0 };
    }

    await prisma.user.update({
        where: { id: userId },
        data: { otpAttempts: newAttempts }
    });

    return { isLockedOut: false, remainingAttempts: OTP_MAX_ATTEMPTS - newAttempts };
};

module.exports = {
    generateOtpCode,
    hashOtp,
    verifyOtpHash,
    verifyOtpCode,
    checkRateLimit,
    isOtpExpired,
    validateOtpState,
    storeOtp,
    clearOtp,
    incrementOtpAttempts
};
