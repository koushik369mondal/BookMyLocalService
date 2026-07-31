const userRepository = require("./user.repository");
const { generateToken } = require("../../utils/jwt.util");
const { userSelect, toSafeUser } = require("../../utils/user.util");
const { USER_ROLES } = require("../../constants/auth.constants");

/**
 * Verify Google ID Token and authenticate, link, or register user.
 * Uses email as the sole unique identifier for lookup and creation.
 */
const googleAuth = async ({ credential, role }) => {
    console.log("[GOOGLE AUTH STEP 1] Initiating Google Sign-In verification...");
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
        console.error("[GOOGLE AUTH STEP 1 ERROR] Tokeninfo fetch failed:", fetchErr);
        const err = new Error("Failed to verify Google token with Google servers");
        err.statusCode = 401;
        throw err;
    }

    if (tokenInfo.error || !tokenInfo.email) {
        console.error("[GOOGLE AUTH STEP 1 ERROR] Invalid Google ID token payload:", tokenInfo);
        const err = new Error(tokenInfo.error_description || "Invalid Google ID token");
        err.statusCode = 401;
        throw err;
    }

    const email = tokenInfo.email.toLowerCase().trim();
    const fullName = tokenInfo.name || tokenInfo.given_name || email.split("@")[0];
    const avatar = tokenInfo.picture || null;

    console.log(`[GOOGLE AUTH STEP 2] Token verified for Email: '${email}', Name: '${fullName}'`);

    console.log(`[GOOGLE AUTH STEP 3] Looking up user in database by email '${email}'...`);
    let user = await userRepository.findByEmail(email);

    let userRole = USER_ROLES.CUSTOMER;
    if (role) {
        const roleUpper = role.toUpperCase();
        if (Object.values(USER_ROLES).includes(roleUpper)) {
            userRole = roleUpper;
        }
    }

    if (!user) {
        console.log(`[GOOGLE AUTH STEP 4] User not found. Creating new user record (Role: ${userRole})...`);
        try {
            user = await userRepository.create({
                fullName: fullName.trim(),
                email,
                phone: null,
                role: userRole,
                isVerified: true,
                avatar
            });
            console.log(`[GOOGLE AUTH STEP 4 SUCCESS] User created with ID: '${user.id}'`);
        } catch (createErr) {
            console.error("[GOOGLE AUTH STEP 4 ERROR] Account creation database exception:", createErr);
            // Race condition check: if user was created concurrently
            user = await userRepository.findByEmail(email);
            if (!user) {
                const detailMsg = process.env.NODE_ENV === "production"
                    ? "Account creation failed. Please try logging in."
                    : (createErr.message || "Database failed to create user record");
                const err = new Error(detailMsg);
                err.statusCode = 400;
                throw err;
            }
            console.log(`[GOOGLE AUTH STEP 4 RECOVERY] Existing user retrieved after concurrent creation: ID '${user.id}'`);
        }
    } else {
        console.log(`[GOOGLE AUTH STEP 4] Existing user found (ID: '${user.id}', Role: '${user.role}'). Linking Google profile...`);
        try {
            const updateData = { isVerified: true };
            if (!user.avatar && avatar) {
                updateData.avatar = avatar;
            }
            user = await userRepository.update(user.id, updateData);
            console.log(`[GOOGLE AUTH STEP 4 SUCCESS] Existing user profile updated`);
        } catch (updateErr) {
            console.warn("[GOOGLE AUTH STEP 4 WARNING] User profile update warning:", updateErr);
        }
    }

    console.log(`[GOOGLE AUTH STEP 5] Generating JWT authentication token for User ID: '${user.id}'...`);
    const token = generateToken({ id: user.id, role: user.role });
    const isProfileComplete = Boolean(user.phone && user.phone.trim() !== "");

    console.log(`[GOOGLE AUTH COMPLETE] Successfully authenticated User ID: '${user.id}', Role: '${user.role}', Complete: ${isProfileComplete}`);

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
