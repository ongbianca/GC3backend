// backend/controllers/courtController.js
const Booking = require("../models/Booking");

/**
 * POST /api/court/availability/check
 * Body: { unitId, date }
 * Returns slots [{ time: "09:00", available: true/false }, ...]
 */
exports.checkAvailability = async (req, res) => {
  try {
    const { unitId, date } = req.body;

    if (!unitId || !date) {
      return res.status(400).json({
        success: false,
        error: "unitId and date are required.",
      });
    }

    // Get all non-cancelled bookings for that unit + date
    const bookings = await Booking.find({
      unitId,
      date,
      status: { $ne: "cancelled" },
    });

    const bookedTimes = new Set(bookings.map((b) => b.time));

    // Simple hourly slots from 08:00 to 22:00
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      const label =
        String(hour).padStart(2, "0") + ":00"; // e.g. "08:00", "09:00"
      slots.push({
        time: label,
        available: !bookedTimes.has(label),
      });
    }

    return res.json({
      success: true,
      unitId,
      date,
      slots,
    });
  } catch (err) {
    console.error("checkAvailability error:", err);
    return res.status(500).json({
      success: false,
      error: "Server error while checking availability.",
    });
  }
};
