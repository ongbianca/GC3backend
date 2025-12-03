const express = require("express");
const router = express.Router();
const coupon = require("../controllers/couponController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", coupon.getCoupons);

// PUBLIC: validate coupon used by users on the booking page
router.post("/validate", coupon.validateCoupon);

// ADMIN ONLY: create new coupons
router.post("/", protect, adminOnly, coupon.createCoupon);

module.exports = router;
