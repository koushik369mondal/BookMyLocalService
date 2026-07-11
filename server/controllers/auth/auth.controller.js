const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/prisma");
const { sendOtpEmail } = require("../../services/emailService");

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
        if (zipCode !== undefined) {
            const trimmedZip = zipCode.trim();
            if (trimmedZip !== "" && !/^\d{6}$/.test(trimmedZip)) {
                return res.status(400).json({ success: false, message: "PIN code must be 6 digits" });
            }
            updateData.zipCode = trimmedZip;
        }

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

// @desc    Send OTP to user email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Please provide an email address" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            return res.status(404).json({ success: false, message: "Account not found." });
        }

        // Rate limiting check: check if the previous OTP was sent within the last 60 seconds
        if (user.otpExpiresAt) {
            const timeUntilExpiry = user.otpExpiresAt.getTime() - Date.now();
            const timeSinceLastSent = (5 * 60 * 1000) - timeUntilExpiry;
            if (timeSinceLastSent > 0 && timeSinceLastSent < 60 * 1000) {
                const secondsToWait = Math.ceil((60 * 1000 - timeSinceLastSent) / 1000);
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${secondsToWait} seconds before requesting a new OTP.`
                });
            }
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the OTP
        const salt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otp, salt);
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save to DB
        await prisma.user.update({
            where: { id: user.id },
            data: {
                otpHash,
                otpExpiresAt,
                otpAttempts: 0
            }
        });

        // Send email
        await sendOtpEmail(normalizedEmail, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    } catch (error) {
        console.error("SendOtp error:", error);
        return res.status(500).json({ success: false, message: "Server error sending OTP", error: error.message });
    }
};

// @desc    Verify OTP code
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Please provide email and OTP code" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find user
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            return res.status(404).json({ success: false, message: "Account not found." });
        }

        // Check if OTP was sent
        if (!user.otpHash || !user.otpExpiresAt) {
            return res.status(400).json({ success: false, message: "No pending verification found. Please request a new OTP." });
        }

        // Check attempts
        if (user.otpAttempts >= 5) {
            // Invalidate OTP
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    otpHash: null,
                    otpExpiresAt: null,
                    otpAttempts: 0
                }
            });
            return res.status(400).json({ success: false, message: "Too many incorrect attempts. Please request a new OTP." });
        }

        // Check expiration
        if (user.otpExpiresAt.getTime() < Date.now()) {
            // Invalidate OTP
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    otpHash: null,
                    otpExpiresAt: null,
                    otpAttempts: 0
                }
            });
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
        }

        // Verify match
        const isMatch = await bcrypt.compare(otp, user.otpHash);
        if (!isMatch) {
            const updatedAttempts = user.otpAttempts + 1;
            
            if (updatedAttempts >= 5) {
                // Invalidate OTP
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        otpHash: null,
                        otpExpiresAt: null,
                        otpAttempts: 0
                    }
                });
                return res.status(400).json({ success: false, message: "Too many incorrect attempts. Please request a new OTP." });
            }

            // Update attempts count
            await prisma.user.update({
                where: { id: user.id },
                data: { otpAttempts: updatedAttempts }
            });

            const remaining = 5 - updatedAttempts;
            return res.status(400).json({ 
                success: false, 
                message: `Invalid verification code. ${remaining} attempts remaining.` 
            });
        }

        // Success - Clear OTP fields and generate token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                otpHash: null,
                otpExpiresAt: null,
                otpAttempts: 0
            }
        });

        const token = generateToken(user.id, user.role);
        
        // Remove sensitive fields
        const safeUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            isVerified: user.isVerified,
            address: user.address,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode,
            createdAt: user.createdAt
        };

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: safeUser
        });
    } catch (error) {
        console.error("VerifyOtp error:", error);
        return res.status(500).json({ success: false, message: "Server error verifying OTP", error: error.message });
    }
};

// @desc    Resend OTP to user email
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOtp = async (req, res) => {
    return sendOtp(req, res);
};

// @desc    Send registration OTP to user email
// @route   POST /api/auth/register/send-otp
// @access  Public
const registerSendOtp = async (req, res) => {
    try {
        const { fullName, email, phone, role } = req.body;

        if (!fullName || !email || !phone) {
            return res.status(400).json({ success: false, message: "Please enter all required fields" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedPhone = phone.trim();

        // Check if verified email exists
        const existingEmailUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existingEmailUser && existingEmailUser.isVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "An account with this email already exists. Please log in." 
            });
        }

        // Check if verified phone exists
        const existingPhoneUser = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
        if (existingPhoneUser && existingPhoneUser.isVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "A user with this phone number already exists." 
            });
        }

        // Rate limiting check for unverified user with same email
        if (existingEmailUser && existingEmailUser.otpExpiresAt) {
            const timeUntilExpiry = existingEmailUser.otpExpiresAt.getTime() - Date.now();
            const timeSinceLastSent = (5 * 60 * 1000) - timeUntilExpiry;
            if (timeSinceLastSent > 0 && timeSinceLastSent < 60 * 1000) {
                const secondsToWait = Math.ceil((60 * 1000 - timeSinceLastSent) / 1000);
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${secondsToWait} seconds before requesting a new OTP.`
                });
            }
        }

        // Delete any unverified user records associated with this email or phone to prevent unique constraint conflicts
        if (existingEmailUser && !existingEmailUser.isVerified) {
            await prisma.user.delete({ where: { id: existingEmailUser.id } });
        }
        
        const duplicatePhoneUser = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
        if (duplicatePhoneUser && !duplicatePhoneUser.isVerified) {
            await prisma.user.delete({ where: { id: duplicatePhoneUser.id } });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the OTP
        const salt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otp, salt);
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        let userRole = "CUSTOMER";
        if (role) {
            const roleUpper = role.toUpperCase();
            if (["CUSTOMER", "PROVIDER", "ADMIN"].includes(roleUpper)) {
                userRole = roleUpper;
            }
        }

        // Create unverified user
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

        // Send email
        await sendOtpEmail(normalizedEmail, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    } catch (error) {
        console.error("registerSendOtp error:", error);
        return res.status(500).json({ success: false, message: "Server error sending OTP", error: error.message });
    }
};

// @desc    Verify registration OTP and create/verify user account
// @route   POST /api/auth/register/verify-otp
// @access  Public
const registerVerifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Please provide email and OTP code" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find unverified user
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user || user.isVerified) {
            return res.status(400).json({ success: false, message: "Registration session not found or user already verified." });
        }

        // Check if OTP was sent
        if (!user.otpHash || !user.otpExpiresAt) {
            return res.status(400).json({ success: false, message: "No pending verification found. Please request a new OTP." });
        }

        // Check attempts
        if (user.otpAttempts >= 5) {
            await prisma.user.delete({ where: { id: user.id } }); // Clear unverified user
            return res.status(400).json({ success: false, message: "Too many incorrect attempts. Please start registration again." });
        }

        // Check expiration
        if (user.otpExpiresAt.getTime() < Date.now()) {
            await prisma.user.delete({ where: { id: user.id } }); // Clear unverified user
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new registration." });
        }

        // Verify match
        const isMatch = await bcrypt.compare(otp, user.otpHash);
        if (!isMatch) {
            const updatedAttempts = user.otpAttempts + 1;
            
            if (updatedAttempts >= 5) {
                await prisma.user.delete({ where: { id: user.id } }); // Clear unverified user
                return res.status(400).json({ success: false, message: "Too many incorrect attempts. Please start registration again." });
            }

            // Update attempts count
            await prisma.user.update({
                where: { id: user.id },
                data: { otpAttempts: updatedAttempts }
            });

            const remaining = 5 - updatedAttempts;
            return res.status(400).json({ 
                success: false, 
                message: `Invalid verification code. ${remaining} attempts remaining.` 
            });
        }

        // Success - Verify user, clear OTP fields
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

        return res.status(200).json({
            success: true,
            message: "Registration verified and account created successfully",
            token,
            user: verifiedUser
        });
    } catch (error) {
        console.error("registerVerifyOtp error:", error);
        return res.status(500).json({ success: false, message: "Server error verifying OTP", error: error.message });
    }
};

// @desc    Send login OTP to user email
// @route   POST /api/auth/login/send-otp
// @access  Public
const loginSendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Please provide an email address" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if verified user exists
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user || !user.isVerified) {
            return res.status(404).json({ success: false, message: "No account found with this email." });
        }

        // Rate limiting check
        if (user.otpExpiresAt) {
            const timeUntilExpiry = user.otpExpiresAt.getTime() - Date.now();
            const timeSinceLastSent = (5 * 60 * 1000) - timeUntilExpiry;
            if (timeSinceLastSent > 0 && timeSinceLastSent < 60 * 1000) {
                const secondsToWait = Math.ceil((60 * 1000 - timeSinceLastSent) / 1000);
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${secondsToWait} seconds before requesting a new OTP.`
                });
            }
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the OTP
        const salt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otp, salt);
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save to DB
        await prisma.user.update({
            where: { id: user.id },
            data: {
                otpHash,
                otpExpiresAt,
                otpAttempts: 0
            }
        });

        // Send email
        await sendOtpEmail(normalizedEmail, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    } catch (error) {
        console.error("loginSendOtp error:", error);
        return res.status(500).json({ success: false, message: "Server error sending OTP", error: error.message });
    }
};

// @desc    Verify login OTP and log in
// @route   POST /api/auth/login/verify-otp
// @access  Public
const loginVerifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Please provide email and OTP code" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find user
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user || !user.isVerified) {
            return res.status(404).json({ success: false, message: "Account not found." });
        }

        // Check if OTP was sent
        if (!user.otpHash || !user.otpExpiresAt) {
            return res.status(400).json({ success: false, message: "No pending verification found. Please request a new OTP." });
        }

        // Check attempts
        if (user.otpAttempts >= 5) {
            // Invalidate OTP
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    otpHash: null,
                    otpExpiresAt: null,
                    otpAttempts: 0
                }
            });
            return res.status(400).json({ success: false, message: "Too many incorrect attempts. Please request a new OTP." });
        }

        // Check expiration
        if (user.otpExpiresAt.getTime() < Date.now()) {
            // Invalidate OTP
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    otpHash: null,
                    otpExpiresAt: null,
                    otpAttempts: 0
                }
            });
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
        }

        // Verify match
        const isMatch = await bcrypt.compare(otp, user.otpHash);
        if (!isMatch) {
            const updatedAttempts = user.otpAttempts + 1;
            
            if (updatedAttempts >= 5) {
                // Invalidate OTP
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        otpHash: null,
                        otpExpiresAt: null,
                        otpAttempts: 0
                    }
                });
                return res.status(400).json({ success: false, message: "Too many incorrect attempts. Please request a new OTP." });
            }

            // Update attempts count
            await prisma.user.update({
                where: { id: user.id },
                data: { otpAttempts: updatedAttempts }
            });

            const remaining = 5 - updatedAttempts;
            return res.status(400).json({ 
                success: false, 
                message: `Invalid verification code. ${remaining} attempts remaining.` 
            });
        }

        // Success - Clear OTP fields
        await prisma.user.update({
            where: { id: user.id },
            data: {
                otpHash: null,
                otpExpiresAt: null,
                otpAttempts: 0
            }
        });

        const token = generateToken(user.id, user.role);
        
        // Remove sensitive fields
        const safeUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            isVerified: user.isVerified,
            address: user.address,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode,
            createdAt: user.createdAt
        };

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: safeUser
        });
    } catch (error) {
        console.error("loginVerifyOtp error:", error);
        return res.status(500).json({ success: false, message: "Server error verifying OTP", error: error.message });
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile,
    changePassword,
    sendOtp,
    verifyOtp,
    resendOtp,
    registerSendOtp,
    registerVerifyOtp,
    loginSendOtp,
    loginVerifyOtp
};
