import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, required: true, enum: ["percentage", "fixed"] },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxUses: { type: Number, default: 0 },
  usedCount: { type: Number, default: 0 },
  expiryDate: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
});

const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema);
export default couponModel;
