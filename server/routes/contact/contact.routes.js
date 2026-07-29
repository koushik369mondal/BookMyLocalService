const express = require("express");
const router = express.Router();
const { submitContactMessage } = require("../../controllers/contact/contact.controller");

// POST /api/contact - Submit contact form inquiry
router.post("/", submitContactMessage);

module.exports = router;
