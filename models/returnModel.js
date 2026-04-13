import mongoose from "mongoose";

const returnSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    required: true,
    default: "Pending",
    enum: ["Pending", "Approved", "Rejected", "Refunded"],
  },
  refundAmount: { type: Number, default: 0 },
  adminNote: { type: String, default: "" },
  date: { type: Number, default: Date.now },
});

const returnModel = mongoose.models.return || mongoose.model("return", returnSchema);
export default returnModel;
