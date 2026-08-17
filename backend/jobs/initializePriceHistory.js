import mongoose from "mongoose";
import Product from "../models/Product.js";

const initialize = async () => {

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    const products = await Product.find({});

    let count = 0;

    for (const product of products) {

      if (
        !product.priceHistory ||
        product.priceHistory.length === 0
      ) {

        product.priceHistory = [
          {
            price: product.price,
            date: product.createdAt || new Date(),
          },
        ];

        await product.save();

        count++;
      }
    }

    console.log(
      `Initialized ${count} products.`
    );

    await mongoose.disconnect();

  } catch (error) {

    console.error(error);

    process.exit(1);
  }
};

initialize();