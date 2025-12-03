// backend/models/Loyalty.js
const mongoose = require("mongoose");

const loyaltySchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loyalty", loyaltySchema);
