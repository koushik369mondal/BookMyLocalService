const prisma = require("../config/prisma");
const { sendOtpEmail } = require("./emailService");
const otpService = require("./otp.service");
const { generateToken } = require("../utils/jwt.util");
const { userSelect, toSafeUser } = require("../utils/user.util");
const { isValidEmail } = require("../utils/validation.util");
const { USER_ROLES } = require("../constants/auth.constants");

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

    // Check for existing verified account with this email
    const existingEmailUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingEmailUser && existingEmailUser.isVerified) {
        const err = new Error("An account with this email already exists. Please log in.");
        err.statusCode = 400;
        throw err;
    }

    // Check rate limit on previous unverified registration attempts
    if (existingEmailUser) {
        const { isRateLimited, secondsToWait } = otpService.checkRateLimit(existingEmailUser.otpExpiresAt);
        if (isRateLimited) {
            const err = new Error(`Please wait ${secondsToWait} seconds before requesting a new OTP.`);
            err.statusCode = 429;
            throw err;
        }

        // Clean up previous unverified record for this email
        await prisma.user.delete({ where: { id: existingEmailUser.id } });
    }

    // Generate and hash OTP
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

    // Create unverified user record
    await prisma.user.create({
        data: {
            fullName: fullName.trim(),
            email: normalizedEmail,
            phone: normalizedPhone,
            role: userRole,
            isVerified: false,
            otpHash,
            otpExpiresAt,
            otpAttempts: 0
        }
    });

    // Send email dispatch
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
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user || user.isVerified) {
        const err = new Error("Registration session not found or user already verified.");
        err.statusCode = 400;
        throw err;
    }

    if (!user.otpHash || !user.otpExpiresAt) {
        const err = new Error("No pending verification found. Please request a new OTP.");
        err.statusCode = 400;
        throw err;
    }

    if (user.otpAttempts >= 5) {
        await prisma.user.delete({ where: { id: user.id } });
        const err = new Error("Too many incorrect attempts. Please start registration again.");
        err.statusCode = 400;
        throw err;
    }

    if (otpService.isOtpExpired(user.otpExpiresAt)) {
        await prisma.user.delete({ where: { id: user.id } });
        const err = new Error("OTP has expired. Please request a new registration.");
        err.statusCode = 400;
        throw err;
    }

    const isValid = otpService.verifyOtpHash(otp, user.otpHash);
    if (!isValid) {
        const { isLockedOut, remainingAttempts } = await otpService.incrementOtpAttempts(user.id, user.otpAttempts);
        if (isLockedOut) {
            await prisma.user.delete({ where: { id: user.id } });
            const err = new Error("Too many incorrect attempts. Please start registration again.");
            err.statusCode = 400;
            throw err;
        }
        const err = new Error(`Invalid verification code. ${remainingAttempts} attempts remaining.`);
        err.statusCode = 400;
        throw err;
    }

    // Success - verify user & clear OTP fields
    const verifiedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            otpHash: null,
            otpExpiresAt: null,
            otpAttempts: 0
        },
        select: userSelect
    });

    const token = generateToken(verifiedUser.id, verifiedUser.role);

    return {
        success: true,
        message: "Registration verified and account created successfully",
        token,
        user: verifiedUser
    };
};

/**
 * Send login OTP to existing user's email.
 */
const sendLoginOtp = async ({ email }) => {
    if (!email) {
        const err = new Error("Please provide an email address");
        err.statusCode = 400;
        throw err;
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!isValidEmail(normalizedEmail)) {
        const err = new Error("Please provide a valid email address");
        err.statusCode = 400;
        throw err;
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !user.isVerified) {
        const err = new Error("No account found with this email.");
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

    await otpService.storeOtp(user.id, otpHash);
    await sendOtpEmail(normalizedEmail, otp, user.fullName || "");

    return { success: true, message: "OTP sent successfully" };
};

/**
 * Verify login OTP and return JWT token with safe user payload.
 */
const verifyLoginOtp = async ({ email, otp }) => {
    if (!email || !otp) {
        const err = new Error("Please provide email and OTP code");
        err.statusCode = 400;
        throw err;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user || !user.isVerified) {
        const err = new Error("Account not found.");
        err.statusCode = 404;
        throw err;
    }

    if (!user.otpHash || !user.otpExpiresAt) {
        const err = new Error("No pending verification found. Please request a new OTP.");
        err.statusCode = 400;
        throw err;
    }

    if (user.otpAttempts >= 5) {
        await otpService.clearOtp(user.id);
        const err = new Error("Too many incorrect attempts. Please request a new OTP.");
        err.statusCode = 400;
        throw err;
    }

    if (otpService.isOtpExpired(user.otpExpiresAt)) {
        await otpService.clearOtp(user.id);
        const err = new Error("OTP has expired. Please request a new one.");
        err.statusCode = 400;
        throw err;
    }

    const isValid = otpService.verifyOtpHash(otp, user.otpHash);
    if (!isValid) {
        const { isLockedOut, remainingAttempts } = await otpService.incrementOtpAttempts(user.id, user.otpAttempts);
        if (isLockedOut) {
            const err = new Error("Too many incorrect attempts. Please request a new OTP.");
            err.statusCode = 400;
            throw err;
        }
        const err = new Error(`Invalid verification code. ${remainingAttempts} attempts remaining.`);
        err.statusCode = 400;
        throw err;
    }

    // Success - clear OTP fields and return session token
    await otpService.clearOtp(user.id);
    const token = generateToken(user.id, user.role);

    return {
        success: true,
        message: "Login successful",
        token,
        user: toSafeUser(user)
    };
};

/**
 * Get current authenticated user profile by ID.
 */
const getUserProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: userSelect
    });
    if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }
    return user;
};

/**
 * Update authenticated user profile fields.
 */
const updateUserProfile = async (userId, updateData) => {
    const fieldsToUpdate = {};
    if (updateData.fullName !== undefined) fieldsToUpdate.fullName = updateData.fullName.trim();
    if (updateData.phone !== undefined) fieldsToUpdate.phone = updateData.phone.trim();
    if (updateData.address !== undefined) fieldsToUpdate.address = updateData.address.trim();
    if (updateData.city !== undefined) fieldsToUpdate.city = updateData.city.trim();
    if (updateData.state !== undefined) fieldsToUpdate.state = updateData.state.trim();
    if (updateData.role !== undefined && (updateData.role === USER_ROLES.PROVIDER || updateData.role === USER_ROLES.CUSTOMER)) {
        fieldsToUpdate.role = updateData.role;
    }

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

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: fieldsToUpdate,
        select: userSelect
    });

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
