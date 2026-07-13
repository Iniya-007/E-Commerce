import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";

export const createCoupon = async (
  req,
  res
) => {
  try {
    const coupon =await Coupon.create({
        code: req.body.code,
        discount: req.body.discount,
        minimumOrderAmount:
        req.body.minimumOrderAmount,
        expiryDate:
        req.body.expiryDate,
    });

    res.status(201).json(
      coupon
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCoupons =
  async (req, res) => {
    try {
      const coupons =
        await Coupon.find();

      res.status(200).json(
        coupons
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const applyCoupon =
  async (req, res) => {
    try {
      const {
        couponCode,
        orderId,
      } = req.body;

      const coupon =
        await Coupon.findOne({
          code:
            couponCode.toUpperCase(),
        });

      if (!coupon) {
        return res.status(404).json({
          message:
            "Invalid coupon",
        });
      }

      const order =
        await Order.findById(
          orderId
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      if (order.coupon) {
  return res.status(400).json({
    message:
      "Coupon already applied",
  });
}


      if (
  order.totalPrice <
  coupon.minimumOrderAmount
) {
  return res.status(400).json({
    message: `Minimum order amount is ₹${coupon.minimumOrderAmount}`,
  });
}


if (
  coupon.expiryDate &&
  new Date() >
    new Date(
      coupon.expiryDate
    )
) {
  return res.status(400).json({
    message: "Coupon expired",
  });
}



      const discountAmount =
        (order.totalPrice *
          coupon.discount) /
        100;

      const finalPrice =
        order.totalPrice -
        discountAmount;

      order.coupon =
        coupon._id;

      order.discountAmount =
        discountAmount;

      order.finalPrice =
        finalPrice;

      await order.save();

      res.status(200).json({
        message:
          "Coupon applied successfully",

        originalPrice:
          order.totalPrice,

        discountAmount,

        finalPrice,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };