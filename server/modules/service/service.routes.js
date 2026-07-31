const express = require("express");
const router = express.Router();
const serviceController = require("./service.controller");
const { protect, authorize } = require("../../middleware/authMiddleware");
const upload = require("../../middleware/uploadMiddleware");

router.get("/categories", serviceController.getServiceCategories);
router.get("/slug/:slug", serviceController.getServiceBySlug);
router.get("/:id", serviceController.getServiceById);
router.get("/", serviceController.getAllServices);

router.post("/", protect, authorize("PROVIDER", "ADMIN"), upload.single("image"), serviceController.createService);
router.put("/:id", protect, authorize("PROVIDER", "ADMIN"), upload.single("image"), serviceController.updateService);
router.delete("/:id", protect, authorize("PROVIDER", "ADMIN"), serviceController.deleteService);

module.exports = router;
