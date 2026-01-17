const Product = require("../../../models/product.model");

exports.getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);

    if (req.query.limit && (isNaN(limit) || limit < 1)) {
      return res.status(400).json({
        error: "Invalid limit parameter. Must be a positive number.",
      });
    }

    const products = await Product.find().limit(limit);
    // .populate("category_id product_size.size product_color");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to fetch products", error });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;

    const product = await Product.aggregate([
      {
        $match: {
          slug,
        },
      },
      {
        $lookup: {
          from: "categories",
          let: { category_id: "$category_id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$category_id"] },
              },
            },
            {
              $project: {
                name: 1,
                type: 1,
              },
            },
          ],
          as: "categories",
        },
      },
    ]);
    res.status(200).json(product[0]);
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to fetch products", error });
  }
};
