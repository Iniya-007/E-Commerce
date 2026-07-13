import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

export const createPayment =
  async (req, res) => {
    try {
      const { orderId } = req.body;

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

      const amount =
        order.finalPrice ||
        order.totalPrice;

      const payment =
        await Payment.create({
          user: req.user._id,
          order: order._id,
          amount,
          status: "Pending",
        });

      res.status(201).json(
        payment
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const paymentSuccess =
  async (req, res) => {
    try {
      const payment =
        await Payment.findById(
          req.params.id
        );

      if (!payment) {
        return res.status(404).json({
          message:
            "Payment not found",
        });
      }

      payment.status =
        "Success";

      payment.transactionId =
        "TXN" +
        Date.now();

      await payment.save();

      await Order.findByIdAndUpdate(
        payment.order,
        {
          isPaid: true,
          paidAt:
            new Date(),
        }
      );

      res.status(200).json({
        message:
          "Payment successful",
        payment,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const paymentFailed =
  async (req, res) => {
    try {
      const payment =
        await Payment.findById(
          req.params.id
        );

      if (!payment) {
        return res.status(404).json({
          message:
            "Payment not found",
        });
      }

      payment.status =
        "Failed";

      await payment.save();

      res.status(200).json({
        message:
          "Payment failed",
        payment,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };