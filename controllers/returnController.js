import returnModel from "../models/returnModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { sendReturnUpdate } from "../utils/emailService.js";

// Request a return (user)
const requestReturn = async (req, res) => {
  try {
    const { userId, orderId, items, reason } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });
    if (order.userId !== userId) return res.json({ success: false, message: "Unauthorized" });
    if (order.status !== "Delivered") {
      return res.json({ success: false, message: "Only delivered orders can be returned" });
    }

    const existing = await returnModel.findOne({ orderId, userId });
    if (existing) return res.json({ success: false, message: "Return request already exists for this order" });

    const returnRequest = new returnModel({
      orderId,
      userId,
      items: items || order.items,
      reason,
      date: Date.now(),
    });

    await returnRequest.save();
    res.json({ success: true, message: "Return request submitted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user's return requests
const getUserReturns = async (req, res) => {
  try {
    const { userId } = req.body;
    const returns = await returnModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, returns });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all return requests (admin)
const allReturns = async (req, res) => {
  try {
    const returns = await returnModel.find({}).sort({ date: -1 });
    res.json({ success: true, returns });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update return request status (admin)
const updateReturnStatus = async (req, res) => {
  try {
    const { returnId, status, refundAmount, adminNote } = req.body;

    const updateData = { status };
    if (refundAmount !== undefined) updateData.refundAmount = refundAmount;
    if (adminNote !== undefined) updateData.adminNote = adminNote;

    const updated = await returnModel.findByIdAndUpdate(returnId, updateData, { new: true });

    if (updated) {
      const user = await userModel.findById(updated.userId);
      if (user) await sendReturnUpdate(user.email, user.name, updated);
    }

    res.json({ success: true, message: "Return status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { requestReturn, getUserReturns, allReturns, updateReturnStatus };
