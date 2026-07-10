const prisma = require("../config/prisma");
const cloudinary = require("../config/cloudinary");

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
    createdAt: true,
    updatedAt: true
};

const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }
        return res.json({ success: true, user: req.user });
    } catch (error) {
        console.error("getProfile error:", error);
        return res.status(500).json({ success: false, message: "Server error fetching profile" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { fullName, phone, address, city, state, zipCode } = req.body;

        const updateData = {};
        if (fullName !== undefined) updateData.fullName = fullName.trim();
        if (phone !== undefined) {
            const normalizedPhone = phone.trim();
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
        console.error("updateProfile error:", error);
        return res.status(500).json({ success: false, message: "Server error updating profile", error: error.message });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image file" });
        }

        // Validate file type
        const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ success: false, message: "Invalid file type. Only JPG, JPEG, PNG, and WebP are allowed." });
        }

        // Validate size (5 MB)
        if (req.file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ success: false, message: "File size exceeds 5MB limit." });
        }

        // Upload to Cloudinary using buffer stream
        const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        
        const uploadResponse = await cloudinary.uploader.upload(base64File, {
            folder: "avatars",
            resource_type: "auto"
        });

        const newAvatarUrl = uploadResponse.secure_url;

        // Delete old avatar from Cloudinary if exists and is from Cloudinary
        if (req.user.avatar && req.user.avatar.includes("cloudinary.com")) {
            try {
                const parts = req.user.avatar.split("/upload/");
                if (parts.length >= 2) {
                    const pathAfterUpload = parts[1];
                    const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
                    const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf("."));
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (err) {
                console.error("Failed to delete old avatar from Cloudinary:", err);
            }
        }

        // Update User
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { avatar: newAvatarUrl },
            select: userSelect
        });

        return res.json({
            success: true,
            message: "Avatar uploaded successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("uploadAvatar error:", error);
        return res.status(500).json({ success: false, message: "Server error uploading avatar", error: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    uploadAvatar
};
