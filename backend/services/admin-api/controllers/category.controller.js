const mongoose = require("mongoose");
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
          as: "subcategories",
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

    const category = await Category.findById(id).populate({
      path: "parent_id",
      select: "name",
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Find subcategories related to this category
    const subcategories = await Category.find({ parent_id: id });

    res.status(200).json({ category, subcategories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, logo_url } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, status, logo_url },
      { new: true },
    );

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Delete the category
    await Category.findByIdAndDelete(id);

    // Delete subcategories associated with this category
    await Category.deleteMany({ parent_id: id });

    res
      .status(200)
      .json({ message: "Category and its subcategories deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createCategory = async (req, res) => {
  try {
    console.log(req.body);
    const { type, name, parent_id, note, status } = req.body;
    const logo_url = req.file ? req.file.path : null; // multer puts file info in req.file

    const category = new Category({
      type: Number(type),
      name,
      parent_id: parent_id || null,
      logo_url,
      note,
      status: status === "true" || status === true, // convert to boolean
    });

    await category.save();
    res.status(201).json({
      status: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
