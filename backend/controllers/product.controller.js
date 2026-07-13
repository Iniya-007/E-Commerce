import Product from "../models/Product.js";

export const createProduct = async (
  req,
  res
) => {
  try {
    const product = await Product.create(
      req.body
    );

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProducts = async (
  req,
  res
) => {
  try {
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const skip =
      (page - 1) * limit;

    let query = {};

    // Search
    if (req.query.keyword) {
      query.name = {
        $regex: req.query.keyword,
        $options: "i",
      };
    }

    // Category Filter
    if (req.query.category) {
      query.category =
        req.query.category;
    }

    // Price Filter
    if (
      req.query.minPrice ||
      req.query.maxPrice
    ) {
      query.price = {};

      if (req.query.minPrice) {
        query.price.$gte =
          Number(
            req.query.minPrice
          );
      }

      if (req.query.maxPrice) {
        query.price.$lte =
          Number(
            req.query.maxPrice
          );
      }
    }

    let sortOption = {};

    // Sorting
    if (req.query.sort) {
      sortOption[
        req.query.sort.replace(
          "-",
          ""
        )
      ] = req.query.sort.startsWith(
        "-"
      )
        ? -1
        : 1;
    }

    const products =
      await Product.find(query)
        .populate("category")
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

    const totalProducts =
      await Product.countDocuments(
        query
      );

    res.status(200).json({
      products,
      currentPage: page,
      totalPages:
        Math.ceil(
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

export const getProductById = async (
  req,
  res
) => {
  try {
    const product =
        await Product.findById(
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


export const uploadProductImage =
async (req,res)=>{

try{

console.log("UPLOAD ROUTE HIT");

console.log("FILE:");

console.log(req.file);

res.status(200).json({

imageUrl:req.file.path

});

}

catch(error){

console.log(error);

res.status(500).json({

message:error.message

});

}

};


export const deleteProduct = async (
  req,
  res
) => {
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
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateProduct = async (req, res) => {
  try {

    const product =
      await Product.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
          runValidators: true
        }

      );

    if (!product) {

      return res.status(404).json({

        message: "Product not found"

      });

    }

    res.status(200).json({

      success: true,

      product

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



  export const getFeaturedProducts =
  async (req, res) => {
    try {
      const products =
        await Product.find({
          featured: true,
        });

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


  export const getRelatedProducts =
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      const related =
        await Product.find({
          category:
            product.category,
          _id: {
            $ne: product._id,
          },
        }).limit(4);

      res.status(200).json(
        related
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };