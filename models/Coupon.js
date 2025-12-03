// backend/models/Coupon.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // e.g. "WELCOME10"
    type: {
      type: String,
      enum: ["percent", "fixed"], // percent = 10% off, fixed = ₱100 off
      required: true,
    },
    amount: { type: Number, required: true }, // percent value or fixed amount

    maxUses: { type: Number, default: null }, // null = unlimited
    used: { type: Number, default: 0 },

    // Store as "YYYY-MM-DD" string or ISO string; simple for now
    expiresAt: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
