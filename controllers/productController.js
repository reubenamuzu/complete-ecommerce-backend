import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Add product (admin)
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller, stock } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory: subCategory || "",
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
      stock: stock ? JSON.parse(stock) : {},
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List products with filtering, sorting, pagination
const listProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      subCategory,
      minPrice,
      maxPrice,
      sort,
      bestseller,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (bestseller === "true") filter.bestseller = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { date: -1 },
      rating: { avgRating: -1 },
    };
    const sortOption = sortMap[sort] || { date: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await productModel.countDocuments(filter);
    const products = await productModel.find(filter).sort(sortOption).skip(skip).limit(Number(limit));

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Search products by keyword with filters
const searchProducts = async (req, res) => {
  try {
    const {
      q,
      page = 1,
      limit = 20,
      category,
      subCategory,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const filter = {};
    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { date: -1 },
      rating: { avgRating: -1 },
    };
    const sortOption = q && !sort
      ? { score: { $meta: "textScore" } }
      : (sortMap[sort] || { date: -1 });

    const skip = (Number(page) - 1) * Number(limit);
    const total = await productModel.countDocuments(filter);
    const products = await productModel
      .find(filter, q ? { score: { $meta: "textScore" } } : {})
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get product recommendations (same category, sorted by rating)
const getRecommendations = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findById(productId);
    if (!product) return res.json({ success: false, message: "Product not found" });

    const recommendations = await productModel
      .find({ category: product.category, _id: { $ne: product._id } })
      .sort({ avgRating: -1, date: -1 })
      .limit(8);

    res.json({ success: true, recommendations });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove product (admin)
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct, searchProducts, getRecommendations };
