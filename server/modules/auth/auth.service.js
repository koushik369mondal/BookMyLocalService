const userRepository = require("./user.repository");
const { generateToken } = require("../../utils/jwt.util");
const { userSelect, toSafeUser } = require("../../utils/user.util");
const { USER_ROLES } = require("../../constants/auth.constants");

/**
 * Verify Google ID Token and authenticate, link, or register user.
 * Uses email as the sole unique identifier for lookup and creation.
 */
const googleAuth = async ({ credential, role }) => {
    if (!credential) {
        const err = new Error("Google credential token is required");
        err.statusCode = 400;
        throw err;
    }

    let tokenInfo;
    try {
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        tokenInfo = await response.json();
    } catch (fetchErr) {
        console.error("Google tokeninfo fetch error:", fetchErr);
        const err = new Error("Failed to verify Google token with Google servers");
        err.statusCode = 401;
        throw err;
    }

    if (tokenInfo.error || !tokenInfo.email) {
        console.error("Google token verification failed:", tokenInfo);
        const err = new Error(tokenInfo.error_description || "Invalid Google ID token");
        err.statusCode = 401;
        throw err;
    }

    const email = tokenInfo.email.toLowerCase().trim();
    const fullName = tokenInfo.name || tokenInfo.given_name || email.split("@")[0];
    const avatar = tokenInfo.picture || null;

    let user = await userRepository.findByEmail(email);

    let userRole = USER_ROLES.CUSTOMER;
    if (role) {
        const roleUpper = role.toUpperCase();
        if (Object.values(USER_ROLES).includes(roleUpper)) {
            userRole = roleUpper;
        }
    }

    if (!user) {
        try {
            // Create new user using Google Profile
            user = await userRepository.create({
                fullName: fullName.trim(),
                email,
                phone: null,
                role: userRole,
                isVerified: true,
                avatar
            });
        } catch (createErr) {
            console.error("Google auth user creation error:", createErr);
            // Race condition check: if user was created concurrently
            user = await userRepository.findByEmail(email);
            if (!user) {
                const err = new Error("Account creation failed. Please try logging in again.");
                err.statusCode = 400;
                throw err;
            }
        }
    } else {
        // Link existing account & verify
        try {
            const updateData = { isVerified: true };
            if (!user.avatar && avatar) {
                updateData.avatar = avatar;
            }
            user = await userRepository.update(user.id, updateData);
        } catch (updateErr) {
            console.error("Google auth profile update warning:", updateErr);
        }
    }

    const token = generateToken({ id: user.id, role: user.role });
    const isProfileComplete = Boolean(user.phone && user.phone.trim() !== "");

    return {
        success: true,
        message: "Google authentication successful",
        user: toSafeUser(user),
        token,
        isProfileComplete
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
 * Update current user profile details (for profile completion & account settings)
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
        const trimmedPhone = updateData.phone ? updateData.phone.trim() : "";
        if (trimmedPhone !== "" && !/^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(trimmedPhone)) {
            const err = new Error("Please enter a valid 10-digit phone number");
            err.statusCode = 400;
            throw err;
        }
        fieldsToUpdate.phone = trimmedPhone === "" ? null : trimmedPhone;
    }

    if (updateData.address !== undefined) fieldsToUpdate.address = updateData.address ? updateData.address.trim() : null;
    if (updateData.city !== undefined) fieldsToUpdate.city = updateData.city ? updateData.city.trim() : null;
    if (updateData.state !== undefined) fieldsToUpdate.state = updateData.state ? updateData.state.trim() : null;

    if (updateData.zipCode !== undefined) {
        const trimmedZip = updateData.zipCode ? updateData.zipCode.trim() : "";
        if (trimmedZip !== "" && !/^\d{6}$/.test(trimmedZip)) {
            const err = new Error("PIN code must be 6 digits");
            err.statusCode = 400;
            throw err;
        }
        fieldsToUpdate.zipCode = trimmedZip === "" ? null : trimmedZip;
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
    googleAuth,
    getUserProfile,
    updateUserProfile
};
