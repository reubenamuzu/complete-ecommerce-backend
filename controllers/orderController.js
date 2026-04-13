import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import couponModel from "../models/couponModel.js";
import { sendOrderConfirmation, sendStatusUpdate } from "../utils/emailService.js";

const PAYSTACK_BASE = "https://api.paystack.co";

// Helper: deduct stock for ordered items
const deductStock = async (items) => {
  for (const item of items) {
    const product = await productModel.findById(item._id);
    if (product && item.size && product.stock && product.stock[item.size] !== undefined) {
      const updated = { ...product.stock };
      updated[item.size] = Math.max(0, (updated[item.size] || 0) - (item.quantity || 1));
      await productModel.findByIdAndUpdate(item._id, { stock: updated });
    }
  }
};

// Helper: validate and compute coupon discount
const resolveCoupon = async (couponCode, orderAmount) => {
  if (!couponCode) return { discount: 0, couponDoc: null };

  const coupon = await couponModel.findOne({ code: couponCode.toUpperCase(), isActive: true });
  if (!coupon) throw new Error("Invalid or inactive coupon code");
  if (coupon.expiryDate && new Date() > coupon.expiryDate) throw new Error("Coupon has expired");
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) throw new Error("Coupon usage limit reached");
  if (orderAmount < coupon.minOrderAmount) {
    throw new Error(`Minimum order amount for this coupon is ${coupon.minOrderAmount}`);
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = Math.round((orderAmount * coupon.discountValue) / 100);
  } else {
    discount = Math.min(coupon.discountValue, orderAmount);
  }

  return { discount, couponDoc: coupon };
};

// Placing orders using Cash On Delivery (COD) Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, couponCode } = req.body;

    let discount = 0;
    let couponDoc = null;

    if (couponCode) {
      const result = await resolveCoupon(couponCode, amount);
      discount = result.discount;
      couponDoc = result.couponDoc;
    }

    const finalAmount = amount - discount;

    const orderData = {
      userId,
      items,
      address,
      amount: finalAmount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      statusHistory: [{ status: "Order placed", timestamp: Date.now() }],
      couponCode: couponCode || "",
      discount,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await deductStock(items);
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    if (couponDoc) {
      await couponModel.findByIdAndUpdate(couponDoc._id, { $inc: { usedCount: 1 } });
    }

    const user = await userModel.findById(userId);
    if (user) await sendOrderConfirmation(user.email, user.name, newOrder);

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Initialize Paystack transaction
const placeOrderPaystack = async (req, res) => {
  try {
    const { userId, items, amount, address, couponCode } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    let discount = 0;
    if (couponCode) {
      const result = await resolveCoupon(couponCode, amount);
      discount = result.discount;
    }

    const finalAmount = amount - discount;

    const paystackRes = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: Math.round(finalAmount * 100),
        metadata: {
          userId,
          items: JSON.stringify(items),
          address: JSON.stringify(address),
          couponCode: couponCode || "",
          discount,
          originalAmount: amount,
        },
      }),
    });

    const data = await paystackRes.json();

    if (!data.status) {
      return res.json({ success: false, message: data.message || "Paystack initialization failed" });
    }

    res.json({
      success: true,
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Paystack payment and save order
const verifyPaystack = async (req, res) => {
  try {
    const { reference } = req.body;

    const paystackRes = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await paystackRes.json();

    if (!data.status || data.data.status !== "success") {
      return res.json({ success: false, message: "Payment verification failed" });
    }

    const meta = data.data.metadata;
    const items = JSON.parse(meta.items);
    const address = JSON.parse(meta.address);
    const finalAmount = data.data.amount / 100;

    let couponDoc = null;
    if (meta.couponCode) {
      couponDoc = await couponModel.findOne({ code: meta.couponCode.toUpperCase() });
    }

    const orderData = {
      userId: meta.userId,
      items,
      address,
      amount: finalAmount,
      paymentMethod: "Paystack",
      payment: true,
      date: Date.now(),
      statusHistory: [{ status: "Order placed", timestamp: Date.now() }],
      couponCode: meta.couponCode || "",
      discount: Number(meta.discount) || 0,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await deductStock(items);
    await userModel.findByIdAndUpdate(meta.userId, { cartData: {} });

    if (couponDoc) {
      await couponModel.findByIdAndUpdate(couponDoc._id, { $inc: { usedCount: 1 } });
    }

    const user = await userModel.findById(meta.userId);
    if (user) await sendOrderConfirmation(user.email, user.name, newOrder);

    res.json({ success: true, message: "Payment verified and order placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All orders data for Admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User order data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status from Admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status, $push: { statusHistory: { status, timestamp: Date.now() } } },
      { new: true }
    );

    if (order) {
      const user = await userModel.findById(order.userId);
      if (user) await sendStatusUpdate(user.email, user.name, order, status);
    }

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderPaystack,
  verifyPaystack,
  allOrders,
  userOrders,
  updateStatus,
};
