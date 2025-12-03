// backend/models/Booking.js
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  ts: { type: String, required: true },
  actor: { type: String, required: true }, // "system", "admin", "user", etc.
  action: { type: String, required: true }, // "created", "confirmed", "rescheduled", etc.
  note: { type: String, default: "" },
});

const bookingSchema = new mongoose.Schema(
  {
    serviceId: { type: String, required: true },
    serviceName: { type: String },

    unitId: { type: String, required: true }, // court/branch ID
    unitName: { type: String },

    date: { type: String, required: true }, // "YYYY-MM-DD"
    time: { type: String, required: true }, // "HH:mm"

    price: { type: Number },

    customerName: { type: String, required: true },
    customerEmail: { type: String },

    couponCode: { type: String, default: null },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    confirmationCode: { type: String, default: null },

    history: { type: [historySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
