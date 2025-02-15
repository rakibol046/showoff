const mongoose = require("mongoose");
const Product = require("../../../models/product.model");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    // .populate("category_id product_size.size product_color");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to fetch products", error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const prod_id = req.params.id;
    const product = await Product.deleteOne({ _id: prod_id });

    if (product.deletedCount === 0) {
      throw new Error("product not found");
    }
    
    res.status(200).json({
      message: "product deleted",
      error: false,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed to deleted product.",
      message: error.message,
      error: true,
    });
  }
};
