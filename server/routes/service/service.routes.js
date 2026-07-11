const express = require("express");
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  getServiceCategories
} = require("../../controllers/service/service.controller");
const { protect, authorize } = require("../../middleware/authMiddleware");
const upload = require("../../middleware/uploadMiddleware");

// Public routes
router.get("/", getAllServices);
router.get("/categories", getServiceCategories);
router.get("/:id", getServiceById);
router.get("/slug/:slug", getServiceBySlug);

// Protected routes (Only providers or admin can manage services)
router.post("/", protect, authorize("PROVIDER", "ADMIN"), upload.single("image"), createService);
router.put("/:id", protect, authorize("PROVIDER", "ADMIN"), upload.single("image"), updateService);
router.delete("/:id", protect, authorize("PROVIDER", "ADMIN"), deleteService);

module.exports = router;
