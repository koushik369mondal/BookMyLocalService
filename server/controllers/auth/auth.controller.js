const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/prisma");

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET || "bookmylocalservice-super-secret-jwt-key-2026",
        { expiresIn: "30d" }
    );
};

const userSelect = {
    id: true,
    fullName: true,
    email: true,
    phone: true,
    role: true,
    avatar: true,
    isVerified: true,
    address: true,
    city: true,
    state: true,
    zipCode: true,
    createdAt: true
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { fullName, email, phone, password, role } = req.body;

        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: "Please enter all required fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedPhone = phone.trim();

        const userExistsEmail = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (userExistsEmail) {
            return res.status(400).json({ success: false, message: "A user with this email address already exists" });
        }

        const userExistsPhone = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
        if (userExistsPhone) {
            return res.status(400).json({ success: false, message: "A user with this phone number already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let userRole = "CUSTOMER";
        if (role) {
            const roleUpper = role.toUpperCase();
            if (["CUSTOMER", "PROVIDER", "ADMIN"].includes(roleUpper)) {
                userRole = roleUpper;
            }
        }

        const user = await prisma.user.create({
            data: {
                fullName,
                email: normalizedEmail,
                phone: normalizedPhone,
                password: hashedPassword,
                role: userRole,
                isVerified: false
            },
            select: userSelect
        });

        const token = generateToken(user.id, user.role);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ success: false, message: "Server error during registration", error: error.message });
    }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        console.log(`[Login] Request received for identifier: "${identifier}"`);

        if (!identifier || !password) {
            console.log("[Login] Missing identifier or password in request");
            return res.status(400).json({ success: false, message: "Please provide email/phone and password" });
        }

        const normalizedIdentifier = identifier.toLowerCase().trim();
        console.log(`[Login] Performing database user lookup for: "${normalizedIdentifier}"`);

        let user = await prisma.user.findUnique({ where: { email: normalizedIdentifier } });
        if (!user) {
            console.log("[Login] User not found by email, attempting lookup by phone");
            user = await prisma.user.findUnique({ where: { phone: normalizedIdentifier } });
        }

        if (!user) {
            console.log(`[Login] User not found for identifier: "${normalizedIdentifier}"`);
            return res.status(401).json({ success: false, message: "Invalid email/phone or password" });
        }

        console.log(`[Login] User located: ID="${user.id}", Email="${user.email}"`);
        console.log("[Login] Performing bcrypt password comparison");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("[Login] Password comparison failed");
            return res.status(401).json({ success: false, message: "Invalid email/phone or password" });
        }

        console.log("[Login] Password verified, generating JWT token");
        const token = generateToken(user.id, user.role);

        console.log(`[Login] JWT token generated successfully for user ID="${user.id}"`);

        const { password: _, ...safeUser } = user;

        console.log(`[Login] Success. Logging in user "${user.email}"`);
        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: safeUser
        });
    } catch (error) {
        console.error("[Login] Critical login handler crash:", error);
        return res.status(500).json({ success: false, message: "Server error during login", error: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, user: req.user });
    } catch (error) {
        console.error("GetMe error:", error);
        return res.status(500).json({ success: false, message: "Server error fetching user profile" });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { fullName, phone, address, city, state, zipCode } = req.body;

        const updateData = {};
        if (fullName !== undefined) updateData.fullName = fullName.trim();
        if (phone !== undefined) {
            const normalizedPhone = phone.trim();
            // Check for duplicate phone if changed
            if (normalizedPhone !== req.user.phone) {
                const existingPhone = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
                if (existingPhone) {
                    return res.status(400).json({ success: false, message: "This phone number is already in use" });
                }
            }
            updateData.phone = normalizedPhone;
        }
        if (address !== undefined) updateData.address = address.trim();
        if (city !== undefined) updateData.city = city.trim();
        if (state !== undefined) updateData.state = state.trim();
        if (zipCode !== undefined) updateData.zipCode = zipCode.trim();

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: "No fields to update" });
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: updateData,
            select: userSelect
        });

        return res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("UpdateProfile error:", error);
        return res.status(500).json({ success: false, message: "Server error updating profile", error: error.message });
    }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Please provide current and new password" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters long" });
        }

        // Fetch user with password hash
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword }
        });

        return res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error("ChangePassword error:", error);
        return res.status(500).json({ success: false, message: "Server error changing password", error: error.message });
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile,
    changePassword
};
