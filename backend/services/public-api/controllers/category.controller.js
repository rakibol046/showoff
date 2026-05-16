const Category = require("../../../models/category.model");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $match: { type: 1 }, // Get only parent categories
      },
      {
        $lookup: {
          from: "categories", // Collection name should match your model
          localField: "_id",
          foreignField: "parent_id",
          as: "child_categories",
        },
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getParentCategories = async (req, res) => {
  try {
    const categories = await Category.find({ type: 1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopCategories = async (req, res) => {
  try {
    const categories = await Category.find({ top: true });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
