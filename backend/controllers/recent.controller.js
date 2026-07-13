import User from "../models/User.js";

export const addRecentlyViewed =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        );

      const productId =
        req.params.productId;

      user.recentlyViewed =
        user.recentlyViewed.filter(
          (id) =>
            id.toString() !==
            productId
        );

      user.recentlyViewed.unshift(
        productId
      );

      user.recentlyViewed =
        user.recentlyViewed.slice(
          0,
          10
        );

      await user.save();

      res.status(200).json({
        message:
          "Recently viewed updated",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const getRecentlyViewed =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        ).populate(
          "recentlyViewed"
        );

      res.status(200).json(
        user.recentlyViewed
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };