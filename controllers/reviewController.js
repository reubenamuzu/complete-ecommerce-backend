import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";

// Recalculate and update product's avgRating and reviewCount
const updateProductRating = async (productId) => {
  const reviews = await reviewModel.find({ productId });
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10
    : 0;
  await productModel.findByIdAndUpdate(productId, { avgRating, reviewCount });
};

// Add a review (one per user per product)
const addReview = async (req, res) => {
  try {
    const { userId, productId, rating, title, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const existing = await reviewModel.findOne({ userId, productId });
    if (existing) {
      return res.json({ success: false, message: "You have already reviewed this product" });
    }

    const review = new reviewModel({ userId, productId, rating, title, comment, date: Date.now() });
    await review.save();
    await updateProductRating(productId);

    res.json({ success: true, message: "Review added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get reviews for a product (paginated)
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await reviewModel.countDocuments({ productId });
    const reviews = await reviewModel
      .find({ productId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      reviews,
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

// Delete a review (admin)
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.body;

    const review = await reviewModel.findById(reviewId);
    if (!review) return res.json({ success: false, message: "Review not found" });

    const { productId } = review;
    await reviewModel.findByIdAndDelete(reviewId);
    await updateProductRating(productId);

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addReview, getProductReviews, deleteReview };
