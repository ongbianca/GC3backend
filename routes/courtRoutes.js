// backend/routes/courtRoutes.js
const express = require("express");
const router = express.Router();
const courtController = require("../controllers/courtController");

// POST /api/court/availability/check
router.post("/availability/check", courtController.checkAvailability);

module.exports = router;
