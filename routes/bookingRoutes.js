// backend/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Create booking
router.post("/", bookingController.createBooking);

// List all bookings
router.get("/", bookingController.getAllBookings);

// Confirm booking
router.post("/:id/confirm", bookingController.confirmBooking);

// Reschedule booking
router.post("/:id/reschedule", bookingController.rescheduleBooking);

module.exports = router;
