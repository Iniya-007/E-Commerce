import Wishlist from "../models/Wishlist.js";

export const addToWishlist = async (
  req,
  res
) => {
  try {
    const { productId } = req.body;

    let wishlist =
      await Wishlist.findOne({
        user: req.user._id,
      });

    if (!wishlist) {
      wishlist =
        await Wishlist.create({
          user: req.user._id,
          products: [],
        });
    }

    const exists =
      wishlist.products.includes(
        productId
      );

    if (!exists) {
      wishlist.products.push(
        productId
      );
    }

    await wishlist.save();

    res.status(200).json(
      wishlist
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getWishlist = async (
  req,
  res
) => {
  try {
    const wishlist =
      await Wishlist.findOne({
        user: req.user._id,
      }).populate("products");

    res.status(200).json(
      wishlist
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeFromWishlist =
  async (req, res) => {
    try {
      const { productId } =
        req.params;

      const wishlist =
        await Wishlist.findOne({
          user: req.user._id,
        });

      if (!wishlist) {
        return res.status(404).json({
          message:
            "Wishlist not found",
        });
      }

      wishlist.products =
        wishlist.products.filter(
          (product) =>
            product.toString() !==
            productId
        );

      await wishlist.save();

      res.status(200).json(
        wishlist
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };