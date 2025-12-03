const Coupon = require("../models/Coupon");

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json({ success: true, coupons });
  } catch (err) {
    console.error("getCoupons error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { code, type, amount, maxUses, expiresAt } = req.body;

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type,
      amount,
      maxUses,
      expiresAt
    });

    res.json({ success: true, coupon });
  } catch (err) {
    console.error("createCoupon error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Validate coupon and compute discounted price
exports.validateCoupon = async (req, res) => {
  try {
    let { code, originalPrice } = req.body;

    // basic input checks
    if (!code) {
      return res
        .status(400)
        .json({ success: false, error: "Coupon code is required" });
    }
    if (originalPrice == null || isNaN(originalPrice)) {
      return res.status(400).json({
        success: false,
        error: "Original price is required",
      });
    }

    code = String(code).toUpperCase();
    const price = Number(originalPrice);

    // Try to find coupon in MongoDB
    let couponDoc = null;
    try {
      couponDoc = await Coupon.findOne({ code });
    } catch (dbErr) {
      console.error("validateCoupon DB lookup error:", dbErr);
    }

    // Fallback list (so codes still work even if DB is empty)
    const fallbackCodes = [
      "BADMINTON20",
      "BASKETBALL20",
      "TENNIS20",
      "PICKLEBALL20",
      "SOCCER20",
    ];

    // Decide discount
    let discountAmount = 0;

    if (couponDoc) {
      // optional: check expiry
      if (couponDoc.expiresAt) {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        if (today > couponDoc.expiresAt) {
          return res
            .status(400)
            .json({ success: false, error: "Coupon has expired" });
        }
      }

      // optional: check max uses
      if (
        couponDoc.maxUses != null &&
        typeof couponDoc.maxUses === "number" &&
        couponDoc.used >= couponDoc.maxUses
      ) {
        return res
          .status(400)
          .json({ success: false, error: "Coupon usage limit reached" });
      }

      if (couponDoc.type === "percent") {
        // e.g. amount = 20  →  20% off
        discountAmount = (couponDoc.amount / 100) * price;
      } else if (couponDoc.type === "fixed") {
        // e.g. amount = 100 → ₱100 off
        discountAmount = couponDoc.amount;
      }
    } else if (fallbackCodes.includes(code)) {
      // If no DB record but code is one of your known ones → 20% off
      discountAmount = 0.2 * price;
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Invalid coupon code" });
    }

    let finalPrice = price - discountAmount;
    if (finalPrice < 0) finalPrice = 0;

    // round to 2 decimal places just in case
    finalPrice = Math.round(finalPrice * 100) / 100;

    return res.json({
      success: true,
      code,
      originalPrice: price,
      discount: discountAmount,
      finalPrice,
    });
  } catch (err) {
    console.error("validateCoupon error:", err);
    return res.status(500).json({
      success: false,
      error: "Server error validating coupon",
    });
  }
};
