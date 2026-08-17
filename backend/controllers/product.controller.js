import Product from "../models/Product.js";
import { predictPrice } from "../services/pricePrediction.service.js";

/*
|--------------------------------------------------------------------------
| CREATE PRODUCT
|--------------------------------------------------------------------------
| IMPORTANT:
| Do NOT call the price prediction model here.
|
| A newly created product does not have enough price history.
| Prediction will happen later when the seller changes the price
| enough times.
|--------------------------------------------------------------------------
*/

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      seller: req.user._id,
    });

    console.log("Product created:", product.name);

    res.status(201).json(product);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET PRODUCTS
|--------------------------------------------------------------------------
*/

export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Search
    if (req.query.keyword) {
      query.name = {
        $regex: req.query.keyword,
        $options: "i",
      };
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Price filter
    if (
      req.query.minPrice ||
      req.query.maxPrice
    ) {
      query.price = {};

      if (req.query.minPrice) {
        query.price.$gte = Number(
          req.query.minPrice
        );
      }

      if (req.query.maxPrice) {
        query.price.$lte = Number(
          req.query.maxPrice
        );
      }
    }

    // Sorting
    let sortOption = {};

    if (req.query.sort) {
      sortOption[
        req.query.sort.replace("-", "")
      ] = req.query.sort.startsWith("-")
        ? -1
        : 1;
    }

    const products = await Product.find(query)
      .populate("category")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalProducts =
      await Product.countDocuments(query);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(
        totalProducts / limit
      ),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET PRODUCT BY ID
|--------------------------------------------------------------------------
*/

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    ).populate("category");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPLOAD PRODUCT IMAGE
|--------------------------------------------------------------------------
*/

export const uploadProductImage = async (
  req,
  res
) => {
  try {
    console.log("UPLOAD ROUTE HIT");

    res.status(200).json({
      imageUrl: req.file.path,
    });
  } catch (error) {
    console.error(
      "UPLOAD PRODUCT IMAGE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| DELETE PRODUCT
|--------------------------------------------------------------------------
*/

export const deleteProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT
|--------------------------------------------------------------------------
|
| PRICE PREDICTION FLOW
|
| Seller changes price
|        ↓
| Add new price to priceHistory
|        ↓
| Do we have 6 observations?
|        ↓
|       YES
|        ↓
| Send latest 6 prices to ML
|        ↓
| Predicted price
|        ↓
| BUY_NOW / WAIT / STABLE
|        ↓
| Save prediction
|
|--------------------------------------------------------------------------
*/

export const updateProduct = async (req, res) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | 1. Find product
    |--------------------------------------------------------------------------
    */

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | 2. Check seller ownership
    |--------------------------------------------------------------------------
    */

    if (
      product.seller.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to edit this product",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | 3. Get old and new price
    |--------------------------------------------------------------------------
    */

    const oldPrice = Number(product.price);

    const newPrice =
      req.body.price !== undefined
        ? Number(req.body.price)
        : oldPrice;


    /*
    |--------------------------------------------------------------------------
    | 4. Update normal product fields
    |--------------------------------------------------------------------------
    */

    Object.assign(product, req.body);


    /*
    |--------------------------------------------------------------------------
    | 5. PRICE HISTORY
    |--------------------------------------------------------------------------
    |
    | Only store a history entry when the price
    | actually changes.
    |
    */

    let priceChanged = false;

    if (newPrice !== oldPrice) {
      priceChanged = true;

      if (!product.priceHistory) {
        product.priceHistory = [];
      }

      product.priceHistory.push({
        price: newPrice,
        date: new Date(),
      });

      console.log(
        `Price changed: ₹${oldPrice} → ₹${newPrice}`
      );
    }


    /*
    |--------------------------------------------------------------------------
    | 6. Keep only latest 30 observations
    |--------------------------------------------------------------------------
    */

    if (
      product.priceHistory &&
      product.priceHistory.length > 30
    ) {
      product.priceHistory =
        product.priceHistory.slice(-30);
    }


    /*
    |--------------------------------------------------------------------------
    | 7. PRICE PREDICTION
    |--------------------------------------------------------------------------
    |
    | The NEW model requires 6 historical prices.
    |
    | Do not call ML if:
    |
    |   history < 6
    |
    | Also, there is no need to call ML if the seller
    | didn't change the price.
    |
    */

    if (
      priceChanged &&
      product.priceHistory &&
      product.priceHistory.length >= 6
    ) {
      console.log(
        "Enough price history. Calling ML..."
      );

      try {
        /*
        |--------------------------------------------------------------------------
        | Take latest 6 prices
        |--------------------------------------------------------------------------
        */

        const latestHistory =
          product.priceHistory
            .slice(-6)
            .map((entry) => Number(entry.price));


        /*
        |--------------------------------------------------------------------------
        | Call Python ML service
        |--------------------------------------------------------------------------
        */

        const prediction =
          await predictPrice({
            ...product.toObject(),

            priceHistory:
              product.priceHistory,
          });


        /*
        |--------------------------------------------------------------------------
        | Get predicted price
        |--------------------------------------------------------------------------
        */

        const predictedPrice =
          Number(
            prediction.predictedPrice ??
            prediction.predicted_price ??
            prediction.price
          );


        /*
        |--------------------------------------------------------------------------
        | Validate prediction
        |--------------------------------------------------------------------------
        */

        if (!Number.isFinite(predictedPrice)) {
          throw new Error(
            "Invalid predicted price returned by ML model"
          );
        }


        /*
        |--------------------------------------------------------------------------
        | Current price
        |--------------------------------------------------------------------------
        */

        const currentPrice =
          Number(product.price);


        /*
        |--------------------------------------------------------------------------
        | Calculate percentage change
        |--------------------------------------------------------------------------
        */

        const changePercent =
          currentPrice > 0
            ? (
                (
                  predictedPrice -
                  currentPrice
                ) /
                currentPrice
              ) * 100
            : 0;


        /*
        |--------------------------------------------------------------------------
        | Recommendation
        |--------------------------------------------------------------------------
        */

        let recommendation = "STABLE";
        let advice =
          "Price is expected to remain relatively stable.";


        if (changePercent <= -2) {
          recommendation = "WAIT";

          advice =
            "📉 Price is likely to decrease. You can wait.";
        } else if (changePercent >= 2) {
          recommendation = "BUY_NOW";

          advice =
            "📈 Price is likely to increase. You can buy now.";
        }


        /*
        |--------------------------------------------------------------------------
        | Save AI results
        |--------------------------------------------------------------------------
        */

        product.aiSuggestedPrice =
          predictedPrice;

        product.priceChangePercent =
          Number(
            changePercent.toFixed(2)
          );

        product.priceRecommendation =
          recommendation;

        product.priceAdvice =
          advice;


        /*
        |--------------------------------------------------------------------------
        | Log only useful information
        |--------------------------------------------------------------------------
        */

        console.log(
          "ML prediction successful:",
          {
            historyUsed: latestHistory,
            currentPrice,
            predictedPrice,
            changePercent:
              Number(
                changePercent.toFixed(2)
              ),
            recommendation,
          }
        );

      } catch (mlError) {

        /*
        |--------------------------------------------------------------------------
        | IMPORTANT
        |--------------------------------------------------------------------------
        |
        | If ML fails, DON'T fail the product update.
        |
        | The seller's price change should still be saved.
        |
        */

        console.error(
          "ML prediction failed:",
          mlError.message
        );
      }
    }


    /*
    |--------------------------------------------------------------------------
    | 8. Save product
    |--------------------------------------------------------------------------
    */

    await product.save();


    /*
    |--------------------------------------------------------------------------
    | 9. Return updated product
    |--------------------------------------------------------------------------
    */

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {

    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET RELATED PRODUCTS
|--------------------------------------------------------------------------
*/

export const getRelatedProducts = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const related =
      await Product.find({
        category: product.category,

        _id: {
          $ne: product._id,
        },
      }).limit(4);

    res.status(200).json(
      related
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET FEATURED PRODUCTS
|--------------------------------------------------------------------------
*/

export const getFeaturedProducts = async (
  req,
  res
) => {
  try {

    const products =
      await Product.find({
        isFeatured: true,
      })
        .populate("category")
        .limit(10);

    res.status(200).json(
      products
    );

  } catch (error) {

    console.error(
      "GET FEATURED PRODUCTS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};