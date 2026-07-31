const userRepository = require("./user.repository");
const { generateToken } = require("../../utils/jwt.util");
const { userSelect, toSafeUser } = require("../../utils/user.util");
const { USER_ROLES } = require("../../constants/auth.constants");

/**
 * Safely create a user record with fallbacks for nullability and legacy schema differences.
 */
const safeCreateUser = async ({ fullName, email, role, avatar }) => {
    const cleanName = (fullName && fullName.trim().length > 0) ? fullName.trim() : "Google User";
    const cleanEmail = email.toLowerCase().trim();

    // Attempt 1: Standard creation with phone: null
    try {
        return await userRepository.create({
            fullName: cleanName,
            email: cleanEmail,
            phone: null,
            role,
            isVerified: true,
            avatar
        });
    } catch (err1) {
        console.warn("[GOOGLE AUTH CREATE TRY 1 FAILED]:", err1?.message || err1);

        // Check if user was created concurrently
        const existing = await userRepository.findByEmail(cleanEmail);
        if (existing) {
            console.log("[GOOGLE AUTH CREATE RECOVERY 1] Existing user found by email:", existing.id);
            return existing;
        }

        // Attempt 2: Creation with phone: ""
        try {
            return await userRepository.create({
                fullName: cleanName,
                email: cleanEmail,
                phone: "",
                role,
                isVerified: true,
                avatar
            });
        } catch (err2) {
            console.warn("[GOOGLE AUTH CREATE TRY 2 FAILED]:", err2?.message || err2);

            const existingRetry = await userRepository.findByEmail(cleanEmail);
            if (existingRetry) {
                console.log("[GOOGLE AUTH CREATE RECOVERY 2] Existing user found by email:", existingRetry.id);
                return existingRetry;
            }

            // Attempt 3: Creation without phone key
            try {
                return await userRepository.create({
                    fullName: cleanName,
                    email: cleanEmail,
                    role,
                    isVerified: true,
                    avatar
                });
            } catch (err3) {
                console.error("[GOOGLE AUTH CREATE TRY 3 FAILED]:", err3?.message || err3);
                throw err3;
            }
        }
    }
};

/**
 * Verify Google ID Token and authenticate, link, or register user.
 * Uses email as the sole unique identifier for lookup and creation.
 */
const googleAuth = async ({ credential, role }) => {
    console.log("[GOOGLE AUTH STEP 1] Verifying Google credential token...");
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
        console.error("[GOOGLE AUTH STEP 1 ERROR] Invalid Google token response:", tokenInfo);
        const err = new Error(tokenInfo.error_description || "Invalid Google ID token");
        err.statusCode = 401;
        throw err;
    }

    const email = tokenInfo.email.toLowerCase().trim();
    const extractedName = tokenInfo.name || tokenInfo.given_name || email.split("@")[0];
    const fullName = (extractedName && extractedName.trim().length > 0) ? extractedName.trim() : "Google User";
    const avatar = tokenInfo.picture || null;

    console.log(`[GOOGLE AUTH STEP 2] Token verified for Email: '${email}', Name: '${fullName}'`);

    console.log(`[GOOGLE AUTH STEP 3] Checking database for existing user with email '${email}'...`);
    let user = await userRepository.findByEmail(email);

    let userRole = USER_ROLES.CUSTOMER;
    if (role && typeof role === "string") {
        const roleUpper = role.toUpperCase();
        if (Object.values(USER_ROLES).includes(roleUpper)) {
            userRole = roleUpper;
        }
    }

    if (!user) {
        console.log(`[GOOGLE AUTH STEP 4] User not found. Creating new user (Role: ${userRole})...`);
        try {
            user = await safeCreateUser({
                fullName,
                email,
                role: userRole,
                avatar
            });
            console.log(`[GOOGLE AUTH STEP 4 SUCCESS] User created/retrieved with ID: '${user.id}'`);
        } catch (createErr) {
            console.error("[GOOGLE AUTH STEP 4 ERROR] User creation exception:", createErr);
            const userFacingMessage = createErr?.message || "Failed to create user account with Google. Please try logging in.";
            const err = new Error(userFacingMessage);
            err.statusCode = 400;
            throw err;
        }
    } else {
        console.log(`[GOOGLE AUTH STEP 4] Existing user found (ID: '${user.id}', Role: '${user.role}'). Linking Google account...`);
        try {
            const updateData = { isVerified: true };
            if (!user.avatar && avatar) {
                updateData.avatar = avatar;
            }
            user = await userRepository.update(user.id, updateData);
            console.log(`[GOOGLE AUTH STEP 4 SUCCESS] Existing user profile updated`);
        } catch (updateErr) {
            console.warn("[GOOGLE AUTH STEP 4 WARNING] Profile update warning:", updateErr);
        }
    }

    console.log(`[GOOGLE AUTH STEP 5] Issuing JWT token for User ID: '${user.id}'...`);
    const token = generateToken({ id: user.id, role: user.role });
    const isProfileComplete = Boolean(user.phone && String(user.phone).trim() !== "");

    console.log(`[GOOGLE AUTH COMPLETE] Successfully authenticated User ID: '${user.id}'`);

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
        const roleUpper = String(updateData.role).toUpperCase();
        if (Object.values(USER_ROLES).includes(roleUpper)) {
            fieldsToUpdate.role = roleUpper;
        }
    }

    if (updateData.fullName !== undefined) {
        const trimmedName = String(updateData.fullName).trim();
        if (trimmedName.length < 2) {
            const err = new Error("Full name must be at least 2 characters long");
            err.statusCode = 400;
            throw err;
        }
        fieldsToUpdate.fullName = trimmedName;
    }

    if (updateData.phone !== undefined) {
        const trimmedPhone = updateData.phone ? String(updateData.phone).trim() : "";
        if (trimmedPhone !== "" && !/^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(trimmedPhone)) {
            const err = new Error("Please enter a valid 10-digit phone number");
            err.statusCode = 400;
            throw err;
        }
        fieldsToUpdate.phone = trimmedPhone === "" ? null : trimmedPhone;
    }

    if (updateData.address !== undefined) fieldsToUpdate.address = updateData.address ? String(updateData.address).trim() : null;
    if (updateData.city !== undefined) fieldsToUpdate.city = updateData.city ? String(updateData.city).trim() : null;
    if (updateData.state !== undefined) fieldsToUpdate.state = updateData.state ? String(updateData.state).trim() : null;

    if (updateData.zipCode !== undefined) {
        const trimmedZip = updateData.zipCode ? String(updateData.zipCode).trim() : "";
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
