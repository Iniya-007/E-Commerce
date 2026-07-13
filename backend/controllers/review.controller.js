import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const createReview = async (
  req,
  res
) => {
  try {
    const {
      productId,
      rating,
      comment,
    } = req.body;

    const existingReview =
      await Review.findOne({
        user: req.user._id,
        product: productId,
      });

    if (existingReview) {
      return res.status(400).json({
        message:
          "You already reviewed this product",
      });
    }

    await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    const reviews =
      await Review.find({
        product: productId,
      });

    const average =
      reviews.reduce(
        (sum, review) =>
          sum + review.rating,
        0
      ) / reviews.length;

    await Product.findByIdAndUpdate(
      productId,
      {
        averageRating:
          average,
        numReviews:
          reviews.length,
      }
    );

    res.status(201).json({
      message:
        "Review added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductReviews =
  async (req, res) => {
    try {
      const reviews =
        await Review.find({
          product:
            req.params.productId,
        }).populate(
          "user",
          "name"
        );

      res.status(200).json(
        reviews
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const deleteReview =
  async (req, res) => {
    try {
      const review =
        await Review.findById(
          req.params.id
        );

      if (!review) {
        return res.status(404).json({
          message:
            "Review not found",
        });
      }

      await review.deleteOne();

      res.status(200).json({
        message:
          "Review deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };