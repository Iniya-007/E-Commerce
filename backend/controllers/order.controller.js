import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";


export const createOrder = async (
  req,
  res
) => {
  try {

    const {
      items,
      addressId,
    } = req.body;


    // -----------------------------------------
    // VALIDATE ITEMS
    // -----------------------------------------

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "No order items provided",
      });
    }


    // -----------------------------------------
    // VALIDATE ADDRESS
    // -----------------------------------------

    if (!addressId) {
      return res.status(400).json({
        message:
          "Delivery address is required",
      });
    }


    const address =
      await Address.findOne({
        _id: addressId,
        user: req.user._id,
      });


    if (!address) {
      return res.status(404).json({
        message:
          "Delivery address not found",
      });
    }


    // -----------------------------------------
    // CREATE ORDER ITEMS
    // -----------------------------------------

    let orderItems = [];

    let totalPrice = 0;


    for (const item of items) {

      if (
        !item.product ||
        !item.quantity ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          message:
            "Invalid product or quantity",
        });
      }


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


      // ---------------------------------------
      // STOCK CHECK
      // ---------------------------------------

      if (
        product.stock <
        item.quantity
      ) {
        return res.status(400).json({
          message:
            `Only ${product.stock} items available for ${product.name}`,
        });
      }


      // ---------------------------------------
      // SAVE ORDER ITEM
      // ---------------------------------------

      orderItems.push({
        product: product._id,

        productName:
          product.name,

        priceAtPurchase:
          product.price,

        quantity:
          item.quantity,
      });


      // ---------------------------------------
      // REDUCE STOCK
      // ---------------------------------------

      product.stock =
        product.stock -
        item.quantity;

      await product.save();


      // ---------------------------------------
      // CALCULATE TOTAL
      // ---------------------------------------

      totalPrice +=
        product.price *
        item.quantity;
    }


    // -----------------------------------------
    // ADDRESS SNAPSHOT
    // -----------------------------------------

    const shippingAddress = {

      fullName:
        address.fullName,

      phone:
        address.phone,

      addressLine1:
        address.addressLine1,

      addressLine2:
        address.addressLine2 || "",

      city:
        address.city,

      state:
        address.state,

      pincode:
        address.pincode,

      country:
        address.country || "India",
    };


    // -----------------------------------------
    // CREATE ORDER
    // -----------------------------------------

    const order =
      await Order.create({

        user:
          req.user._id,

        items:
          orderItems,

        totalPrice,

        shippingAddress,

        finalPrice:
          totalPrice,
      });


    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    res.status(201).json(order);

  } catch (error) {

    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    res.status(500).json({
      message:
        error.message,
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