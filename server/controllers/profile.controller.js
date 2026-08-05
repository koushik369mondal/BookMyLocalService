const prisma = require("../config/prisma");
const cloudinary = require("../config/cloudinary");
const authService = require("../modules/auth/auth.service");
const { userSelect } = require("../utils/user.util");

const getProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }
        const user = await authService.getUserProfile(req.user.id);
        return res.json({ success: true, user });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        console.error("getProfile error:", error);
        return res.status(500).json({ success: false, message: "Server error fetching profile" });
    }
};

const updateProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }
        const updatedUser = await authService.updateUserProfile(req.user.id, req.body);
        return res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        console.error("updateProfile error:", error);
        return res.status(500).json({ success: false, message: "Server error updating profile", error: error.message });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image file" });
        }

        const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ success: false, message: "Invalid file type. Only JPG, JPEG, PNG, and WebP are allowed." });
        }

        if (req.file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ success: false, message: "File size exceeds 5MB limit." });
        }

        const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        
        const uploadResponse = await cloudinary.uploader.upload(base64File, {
            folder: "avatars",
            resource_type: "auto",
            transformation: [
                { width: 400, height: 400, crop: "fill", gravity: "face", quality: "auto", fetch_format: "auto" }
            ]
        });

        const newAvatarUrl = uploadResponse.secure_url;

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
