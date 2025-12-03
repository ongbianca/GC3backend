// backend/controllers/bookingController.js
const Booking = require("../models/Booking");
const Loyalty = require("../models/Loyalty");
const { sendApiError } = require("../utils/apiError"); // make sure this file exists

// Simple helper to log changes into booking.history
function pushHistory(booking, actor, action, note = "") {
  if (!booking.history) booking.history = [];
  booking.history.push({
    ts: new Date().toISOString(),
    actor,
    action,
    note,
  });
}

/**
 * POST /api/bookings   (alias: /api/book)
 * Creates a new booking / reservation.
 */
async function createBooking(req, res, next) {
  try {
    const {
      serviceId,
      serviceName,
      unitId,
      unitName,
      date,
      time,
      customerName,
      contact,
      price,
      couponCode,
    } = req.body;

    // 🔍 Basic input validation
    if (!serviceId || !serviceName) {
      return sendApiError(res, 400, "Missing service information", 1001);
    }
    if (!unitId || !unitName) {
      return sendApiError(res, 400, "Missing unit information", 1002);
    }
    if (!date || !time) {
      return sendApiError(res, 400, "Date and time are required", 1003);
    }
    if (!customerName) {
      return sendApiError(res, 400, "Customer name is required", 1004);
    }

    // price may be null for some flows
    const safePrice = typeof price === "number" ? price : null;

    const booking = await Booking.create({
      serviceId,
      serviceName,
      unitId,
      unitName,
      date,
      time,
      customerName,
      contact,
      price: safePrice,
      couponCode: couponCode || null,
      status: "pending",
      history: [],
    });

    pushHistory(booking, "system", "created", "Booking created");
    await booking.save();

    return res.status(201).json({
      success: true,
      booking,
    });
  } catch (err) {
    return next(err); // let global error handler format it
  }
}

/**
 * GET /api/bookings
 * Returns all bookings (for dashboard).
 */
async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      bookings,
    });
  } catch (err) {
    console.error("getAllBookings error:", err);
    return sendApiError(
      res,
      500,
      "Server error while fetching bookings.",
      2001
    );
  }
}

/**
 * POST /api/bookings/:id/confirm
 * (Also works via /api/book/:id/confirm because of alias in server.js)
 */
async function confirmBooking(req, res) {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return sendApiError(res, 404, "Booking not found.", 2002);
    }

    if (booking.status === "cancelled") {
      return sendApiError(
        res,
        400,
        "Cannot confirm a cancelled booking.",
        2003
      );
    }

    booking.status = "confirmed";
    if (!booking.confirmationCode) {
      booking.confirmationCode = "CONF-" + Date.now(); // simple unique-ish code
    }

    // Simple loyalty: +3 points per confirmed booking
    let loyalty = await Loyalty.findOne({
      customerName: booking.customerName,
    });
    if (!loyalty) {
      loyalty = new Loyalty({
        customerName: booking.customerName,
        points: 0,
      });
    }
    loyalty.points += 3;
    await loyalty.save();

    pushHistory(booking, "system", "loyalty_earned", "+3 loyalty points");
    pushHistory(booking, "admin", "confirmed", "Booking confirmed");
    await booking.save();

    return res.json({
      success: true,
      booking,
    });
  } catch (err) {
    console.error("confirmBooking error:", err);
    return sendApiError(
      res,
      500,
      "Server error while confirming booking.",
      2004
    );
  }
}

/**
 * POST /api/bookings/:id/reschedule
 */
async function rescheduleBooking(req, res) {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    if (!date || !time) {
      return sendApiError(
        res,
        400,
        "New date and time are required.",
        2005
      );
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return sendApiError(res, 404, "Booking not found.", 2006);
    }

    if (booking.status === "cancelled") {
      return sendApiError(
        res,
        400,
        "Cannot reschedule a cancelled booking.",
        2007
      );
    }

    // Check if new slot is free
    const conflict = await Booking.findOne({
      unitId: booking.unitId,
      date,
      time,
      status: { $ne: "cancelled" },
      _id: { $ne: id },
    });

    if (conflict) {
      return sendApiError(res, 409, "New slot is already booked.", 2008);
    }

    booking.date = date;
    booking.time = time;

    pushHistory(
      booking,
      "system",
      "rescheduled",
      `Rescheduled to ${date} ${time}`
    );
    await booking.save();

    return res.json({
      success: true,
      booking,
    });
  } catch (err) {
    console.error("rescheduleBooking error:", err);
    return sendApiError(
      res,
      500,
      "Server error while rescheduling booking.",
      2009
    );
  }
}

module.exports = {
  createBooking,
  getAllBookings,
  confirmBooking,
  rescheduleBooking,
};
