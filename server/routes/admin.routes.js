const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/users", adminController.getUsers);
router.get("/providers", adminController.getProviders);
router.put("/verify-provider/:id", adminController.verifyProvider);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;
