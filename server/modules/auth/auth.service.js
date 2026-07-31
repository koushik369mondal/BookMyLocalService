const userRepository = require("./user.repository");
const { sendOtpEmail } = require("../../services/emailService");
const otpService = require("./otp.service");
const { generateToken } = require("../../utils/jwt.util");
const { userSelect, toSafeUser } = require("../../utils/user.util");
const { isValidEmail } = require("../../utils/validation.util");
const { USER_ROLES } = require("../../constants/auth.constants");

/**
 * Send registration OTP to email for user onboarding.
 */
const sendRegisterOtp = async ({ fullName, email, phone, role }) => {
    if (!fullName || !email || !phone) {
        const err = new Error("Please enter all required fields");
        err.statusCode = 400;
        throw err;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.trim();

    if (!isValidEmail(normalizedEmail)) {
        const err = new Error("Please provide a valid email address");
        err.statusCode = 400;
        throw err;
    }

    const existingEmailUser = await userRepository.findByEmail(normalizedEmail);
    if (existingEmailUser && existingEmailUser.isVerified) {
        const err = new Error("An account with this email already exists. Please log in.");
        err.statusCode = 400;
        throw err;
    }

    if (existingEmailUser) {
        const { isRateLimited, secondsToWait } = otpService.checkRateLimit(existingEmailUser.otpExpiresAt);
        if (isRateLimited) {
            const err = new Error(`Please wait ${secondsToWait} seconds before requesting a new OTP.`);
            err.statusCode = 429;
            throw err;
        }

        await userRepository.delete(existingEmailUser.id);
    }

    const otp = otpService.generateOtpCode();
    const otpHash = otpService.hashOtp(otp);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    let userRole = USER_ROLES.CUSTOMER;
    if (role) {
        const roleUpper = role.toUpperCase();
        if (Object.values(USER_ROLES).includes(roleUpper)) {
            userRole = roleUpper;
        }
    }

    await userRepository.create({
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        role: userRole,
        isVerified: false,
        otpHash,
        otpExpiresAt,
        otpAttempts: 0
    });

    await sendOtpEmail(normalizedEmail, otp, fullName.trim());

    return { success: true, message: "OTP sent successfully" };
};

/**
 * Verify registration OTP code and complete user onboarding.
 */
const verifyRegisterOtp = async ({ email, otp }) => {
    if (!email || !otp) {
        const err = new Error("Please provide email and OTP code");
        err.statusCode = 400;
        throw err;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user || user.isVerified) {
        const err = new Error("Registration session not found or user already verified.");
        err.statusCode = 400;
        throw err;
    }

    const validation = otpService.validateOtpState(user);
    if (!validation.valid) {
        const err = new Error(validation.reason);
        err.statusCode = 400;
        throw err;
    }

    const isMatch = otpService.verifyOtpCode(otp, user.otpHash);
    if (!isMatch) {
        await userRepository.update(user.id, {
            otpAttempts: user.otpAttempts + 1
        });
        const err = new Error("Invalid OTP. Please try again.");
        err.statusCode = 400;
        throw err;
    }

    const verifiedUser = await userRepository.update(user.id, {
        isVerified: true,
        otpHash: null,
        otpExpiresAt: null,
        otpAttempts: 0
    });

    const token = generateToken({ id: verifiedUser.id, role: verifiedUser.role });

    return {
        success: true,
        message: "Account verified successfully",
        user: toSafeUser(verifiedUser),
        token
    };
};

/**
 * Send login OTP to existing user's email.
 */
const sendLoginOtp = async ({ email }) => {
    if (!email) {
        const err = new Error("Email address is required");
        err.statusCode = 400;
        throw err;
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!isValidEmail(normalizedEmail)) {
        const err = new Error("Please enter a valid email address");
        err.statusCode = 400;
        throw err;
    }

    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user) {
        const err = new Error("No account found with this email address");
        err.statusCode = 404;
        throw err;
    }

    const { isRateLimited, secondsToWait } = otpService.checkRateLimit(user.otpExpiresAt);
    if (isRateLimited) {
        const err = new Error(`Please wait ${secondsToWait} seconds before requesting a new OTP.`);
        err.statusCode = 429;
        throw err;
    }

    const otp = otpService.generateOtpCode();
    const otpHash = otpService.hashOtp(otp);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await userRepository.update(user.id, {
        otpHash,
        otpExpiresAt,
        otpAttempts: 0
    });

    await sendOtpEmail(normalizedEmail, otp, user.fullName);

    return { success: true, message: "Login OTP sent successfully" };
};

/**
 * Verify login OTP code and issue auth token.
 */
const verifyLoginOtp = async ({ email, otp }) => {
    if (!email || !otp) {
        const err = new Error("Please provide email and OTP code");
        err.statusCode = 400;
        throw err;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }

    const validation = otpService.validateOtpState(user);
    if (!validation.valid) {
        const err = new Error(validation.reason);
        err.statusCode = 400;
        throw err;
    }

    const isMatch = otpService.verifyOtpCode(otp, user.otpHash);
    if (!isMatch) {
        await userRepository.update(user.id, {
            otpAttempts: user.otpAttempts + 1
        });
        const err = new Error("Invalid OTP code");
        err.statusCode = 400;
        throw err;
    }

    const loggedInUser = await userRepository.update(user.id, {
        isVerified: true,
        otpHash: null,
        otpExpiresAt: null,
        otpAttempts: 0
    });

    const token = generateToken({ id: loggedInUser.id, role: loggedInUser.role });

    return {
        success: true,
        message: "Login successful",
        user: toSafeUser(loggedInUser),
        token
    };
};

/**
 * Get current user profile details
 */
const getUserProfile = async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }
    return toSafeUser(user);
};

/**
 * Update current user profile details
 */
const updateUserProfile = async (userId, updateData) => {
    const user = await userRepository.findById(userId);
    if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }

    const fieldsToUpdate = {};

    if (updateData.role !== undefined) {
        const roleUpper = updateData.role.toUpperCase();
        if (Object.values(USER_ROLES).includes(roleUpper)) {
            fieldsToUpdate.role = roleUpper;
        }
    }

    if (updateData.fullName !== undefined) {
        const trimmedName = updateData.fullName.trim();
        if (trimmedName.length < 2) {
            const err = new Error("Full name must be at least 2 characters long");
            err.statusCode = 400;
            throw err;
        }
        fieldsToUpdate.fullName = trimmedName;
    }

    if (updateData.phone !== undefined) {
        const trimmedPhone = updateData.phone.trim();
        if (!/^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(trimmedPhone)) {
            const err = new Error("Please enter a valid 10-digit phone number");
            err.statusCode = 400;
            throw err;
        }
        fieldsToUpdate.phone = trimmedPhone;
    }

    if (updateData.address !== undefined) fieldsToUpdate.address = updateData.address.trim();
    if (updateData.city !== undefined) fieldsToUpdate.city = updateData.city.trim();
    if (updateData.state !== undefined) fieldsToUpdate.state = updateData.state.trim();

    if (updateData.zipCode !== undefined) {
        const trimmedZip = updateData.zipCode.trim();
        if (trimmedZip !== "" && !/^\d{6}$/.test(trimmedZip)) {
            const err = new Error("PIN code must be 6 digits");
            err.statusCode = 400;
            throw err;
        }
        fieldsToUpdate.zipCode = trimmedZip;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        const err = new Error("No fields to update");
        err.statusCode = 400;
        throw err;
    }

    const updatedUser = await userRepository.update(userId, fieldsToUpdate);
    return updatedUser;
};

module.exports = {
    sendRegisterOtp,
    verifyRegisterOtp,
    sendLoginOtp,
    verifyLoginOtp,
    getUserProfile,
    updateUserProfile
};
