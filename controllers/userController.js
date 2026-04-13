import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import userModel from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User doesn't exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId).select("-password -cartData");
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update user profile (name, phone)
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    await userModel.findByIdAndUpdate(userId, updateData);
    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Add an address
const addAddress = async (req, res) => {
  try {
    const { userId, label, street, city, state, zip, country } = req.body;

    const address = { id: randomUUID(), label, street, city, state, zip, country };
    await userModel.findByIdAndUpdate(userId, { $push: { addresses: address } });
    res.json({ success: true, message: "Address added", address });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove an address by id
const removeAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    const updatedAddresses = user.addresses.filter((a) => a.id !== addressId);
    await userModel.findByIdAndUpdate(userId, { addresses: updatedAddresses });
    res.json({ success: true, message: "Address removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.wishlist.includes(productId)) {
      return res.json({ success: false, message: "Product already in wishlist" });
    }

    await userModel.findByIdAndUpdate(userId, { $push: { wishlist: productId } });
    res.json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    await userModel.findByIdAndUpdate(userId, { $pull: { wishlist: productId } });
    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user wishlist
const getWishlist = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId).select("wishlist");
    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  getProfile,
  updateProfile,
  addAddress,
  removeAddress,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
