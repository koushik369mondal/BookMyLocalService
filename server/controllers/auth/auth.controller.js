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

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { fullName, email, phone, password, role } = req.body;

        // Validation
        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: "Please enter all required fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedPhone = phone.trim();

        // Check duplicate email
        const userExistsEmail = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (userExistsEmail) {
            return res.status(400).json({ success: false, message: "A user with this email address already exists" });
        }

        // Check duplicate phone
        const userExistsPhone = await prisma.user.findUnique({
            where: { phone: normalizedPhone }
        });

        if (userExistsPhone) {
            return res.status(400).json({ success: false, message: "A user with this phone number already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Map role
        let userRole = "CUSTOMER";
        if (role) {
            const roleUpper = role.toUpperCase();
            if (["CUSTOMER", "PROVIDER", "ADMIN"].includes(roleUpper)) {
                userRole = roleUpper;
            }
        }

        // Save user
        const user = await prisma.user.create({
            data: {
                fullName,
                email: normalizedEmail,
                phone: normalizedPhone,
                password: hashedPassword,
                role: userRole,
                isVerified: false
            }
        });

        // Token
        const token = generateToken(user.id, user.role);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            }
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
        const { identifier, password } = req.body; // identifier can be email or phone

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: "Please provide email/phone and password" });
        }

        const normalizedIdentifier = identifier.toLowerCase().trim();

        // Search user by email or phone
        let user = await prisma.user.findUnique({
            where: { email: normalizedIdentifier }
        });

        if (!user) {
            user = await prisma.user.findUnique({
                where: { phone: normalizedIdentifier }
            });
        }

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email/phone or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email/phone or password" });
        }

        // Generate Token
        const token = generateToken(user.id, user.role);

        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("Login error:", error);
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

        return res.json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.error("GetMe error:", error);
        return res.status(500).json({ success: false, message: "Server error fetching user profile" });
    }
};

module.exports = {
    register,
    login,
    getMe
};
