const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar } = require("../controllers/profile.controller");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);

module.exports = router;
