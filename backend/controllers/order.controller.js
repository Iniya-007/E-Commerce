import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (
  req,
  res
) => {
  try {
    const { items } = req.body;

    let orderItems = [];

    let totalPrice = 0;

    for (const item of items) {
      const product =
        await Product.findById(
          item.product
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      if (
        product.stock <
        item.quantity
      ) {
        return res.status(400).json({
          message: `Only ${product.stock} items available for ${product.name}`,
        });
      }

      orderItems.push({
        product: product._id,
        productName: product.name,
        priceAtPurchase:
          product.price,
        quantity:
          item.quantity,
      });

      product.stock =
        product.stock -
        item.quantity;

      await product.save();

      totalPrice +=
        product.price *
        item.quantity;
    }

    const order =
      await Order.create({
        user: req.user._id,
        items: orderItems,
        totalPrice,
      });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getMyOrders =
  async (req, res) => {
    try {
      const orders =
        await Order.find({
          user: req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json(
        orders
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    ).populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const cancelOrder = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = "Cancelled";

    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateOrderStatus =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      order.status =
        req.body.status;

      await order.save();

      res.status(200).json({
        message:
          "Order status updated",
        order,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };