import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getDashboardStats =
  async (req, res) => {
    try {
      const totalUsers =
        await User.countDocuments();

      const totalProducts =
        await Product.countDocuments();

      const totalOrders =
        await Order.countDocuments();

      const orders =
        await Order.find({
          isPaid: true,
        });

      let totalSales = 0;

      orders.forEach((order) => {
        totalSales +=
          order.finalPrice ||
          order.totalPrice;
      });

      res.status(200).json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalSales,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };



  export const getSalesAnalytics =
  async (req, res) => {
    try {
      const orders =
        await Order.find({
          isPaid: true,
        });

      let totalSales = 0;
      let todaySales = 0;
      let monthSales = 0;
      let yearSales = 0;

      const today = new Date();

      orders.forEach((order) => {
        const amount =
          order.finalPrice ||
          order.totalPrice;

        totalSales += amount;

        const orderDate =
          new Date(
            order.createdAt
          );

        // Today
        if (
          orderDate.toDateString() ===
          today.toDateString()
        ) {
          todaySales += amount;
        }

        // Current Month
        if (
          orderDate.getMonth() ===
            today.getMonth() &&
          orderDate.getFullYear() ===
            today.getFullYear()
        ) {
          monthSales += amount;
        }

        // Current Year
        if (
          orderDate.getFullYear() ===
          today.getFullYear()
        ) {
          yearSales += amount;
        }
      });

      res.status(200).json({
        totalOrders:
          orders.length,

        totalSales,

        todaySales,

        monthSales,

        yearSales,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  

  export const getBestSellingProducts =
  async (req, res) => {
    try {
      const orders =
        await Order.find({
          isPaid: true,
        });

      const productSales = {};

      orders.forEach((order) => {
        order.items.forEach(
          (item) => {
            if (
              productSales[
                item.productName
              ]
            ) {
              productSales[
                item.productName
              ] += item.quantity;
            } else {
              productSales[
                item.productName
              ] = item.quantity;
            }
          }
        );
      });

      const bestSelling =
        Object.entries(
          productSales
        )
          .map(
            ([productName, sold]) => ({
              productName,
              sold,
            })
          )
          .sort(
            (a, b) =>
              b.sold - a.sold
          );

      res.status(200).json(
        bestSelling
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

  export const getLowStockProducts =
  async (req, res) => {
    try {
      const products =
        await Product.find({
          stock: { $lte: 5 },
        });

      if (
        products.length === 0
      ) {
        return res.status(200).json({
          message:
            "No low stock products",
        });
      }

      res.status(200).json(
        products
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };