import couponModel from "../models/couponModel.js";

// Apply / validate a coupon (user at checkout)
const applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    const coupon = await couponModel.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.json({ success: false, message: "Invalid or inactive coupon code" });

    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return res.json({ success: false, message: "Coupon has expired" });
    }
    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return res.json({ success: false, message: "Coupon usage limit reached" });
    }
    if (orderAmount < coupon.minOrderAmount) {
      return res.json({
        success: false,
        message: `Minimum order amount for this coupon is ${coupon.minOrderAmount}`,
      });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = Math.round((orderAmount * coupon.discountValue) / 100);
    } else {
      discount = Math.min(coupon.discountValue, orderAmount);
    }

    res.json({
      success: true,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      finalAmount: orderAmount - discount,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Create a coupon (admin)
const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiryDate } = req.body;

    const existing = await couponModel.findOne({ code: code.toUpperCase() });
    if (existing) return res.json({ success: false, message: "Coupon code already exists" });

    const coupon = new couponModel({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxUses: maxUses || 0,
      expiryDate: expiryDate || null,
    });

    await coupon.save();
    res.json({ success: true, message: "Coupon created", coupon });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List all coupons (admin)
const listCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({}).sort({ _id: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete (deactivate) a coupon (admin)
const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.body;
    await couponModel.findByIdAndUpdate(couponId, { isActive: false });
    res.json({ success: true, message: "Coupon deactivated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { applyCoupon, createCoupon, listCoupons, deleteCoupon };
