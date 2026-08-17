import cron from "node-cron";
import Product from "../models/Product.js";

const recordDailyPrices = async () => {

  try {

    console.log(
      "Starting daily price history recording..."
    );

    const products = await Product.find({
      isActive: true,
    });

    let updatedCount = 0;

    for (const product of products) {

      // Don't add duplicate history
      // if today's price was already recorded.

      const history =
        product.priceHistory || [];

      const lastEntry =
        history[history.length - 1];

      const today = new Date();

      let alreadyRecordedToday = false;

      if (lastEntry?.date) {

        const lastDate =
          new Date(lastEntry.date);

        alreadyRecordedToday =
          lastDate.toDateString() ===
          today.toDateString();
      }

      if (!alreadyRecordedToday) {

        product.priceHistory.push({
          price: product.price,
          date: today,
        });

        // Keep only the latest 30 records
        if (product.priceHistory.length > 30) {

          product.priceHistory =
            product.priceHistory.slice(-30);

        }

        await product.save();

        updatedCount++;
      }
    }

    console.log(
      `Daily price history completed. Updated ${updatedCount} products.`
    );

  } catch (error) {

    console.error(
      "Daily price history error:",
      error
    );
  }
};


// Run every day at midnight
// cron.schedule(
//   "* * * * *",
//   recordDailyPrices
// );

console.log(
  "Price history scheduler started."
);