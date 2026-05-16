const mongoose = require("mongoose");
const Product = require("../../../models/product.model");

// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     // .populate("category_id product_size.size product_color");
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: "❌ Failed to fetch products", error });
//   }
// };

exports.getProducts = async (req, res) => {
  try {
    const {
      name,
      parentcat,
      childcat,
      color,
      size,
      limit = 10,
      page = 1,
      price,
      sort = "-createdAt",
      super_offer,
      status,
      min_price,
      max_price,
    } = req.query;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
      return res.status(400).json({
        success: false,
        error: "Invalid limit parameter. Must be between 1 and 100.",
      });
    }

    if (isNaN(parsedPage) || parsedPage < 1) {
      return res.status(400).json({
        success: false,
        error: "Invalid page parameter. Must be a positive number.",
      });
    }

    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (status !== undefined) {
      filter.status = status === "true";
    } else {
      filter.status = true;
    }

    if (super_offer !== undefined) {
      filter.super_offer = super_offer === "true";
    }

    if (min_price || max_price) {
      filter.sell_price = {};
      if (min_price) filter.sell_price.$gte = parseFloat(min_price);
      if (max_price) filter.sell_price.$lte = parseFloat(max_price);
    }

    if (price && !min_price && !max_price) {
      filter.sell_price = parseFloat(price);
    }

    if (parentcat) {
      const parentCategory = await Category.findOne({
        name: parentcat,
        type: 1,
        status: true,
      });

      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          error: `Parent category '${parentcat}' not found`,
        });
      }

      const childCategories = await Category.find({
        parent_id: parentCategory._id,
        status: true,
      });

      const childCategoryIds = childCategories.map((cat) => cat._id);

      const subChildCategories = await Category.find({
        parent_id: { $in: childCategoryIds },
        status: true,
      });

      const subChildCategoryIds = subChildCategories.map((cat) => cat._id);

      const allCategoryIds = [
        parentCategory._id,
        ...childCategoryIds,
        ...subChildCategoryIds,
      ];

      filter.category_id = { $in: allCategoryIds };
    }

    if (childcat) {
      const childCategory = await Category.findOne({
        name: childcat,
        type: 2,
        status: true,
      });

      if (!childCategory) {
        return res.status(404).json({
          success: false,
          error: `Child category '${childcat}' not found`,
        });
      }

      const subChildCategories = await Category.find({
        parent_id: childCategory._id,
        status: true,
      });

      const subChildCategoryIds = subChildCategories.map((cat) => cat._id);

      const categoryIds = [childCategory._id, ...subChildCategoryIds];

      if (filter.category_id) {
        filter.category_id.$in = filter.category_id.$in.filter((id) =>
          categoryIds.some((catId) => catId.equals(id)),
        );
      } else {
        filter.category_id = { $in: categoryIds };
      }
    }

    if (color) {
      const colors = color.split(",").map((c) => c.trim());
      const colorDocs = await Color.find({
        name: { $in: colors },
        status: true,
      });

      if (colorDocs.length === 0) {
        return res.status(404).json({
          success: false,
          error: `Color(s) '${color}' not found`,
        });
      }

      const colorIds = colorDocs.map((c) => c._id);
      filter.color_id = { $in: colorIds };
    }

    if (size) {
      const sizes = size.split(",").map((s) => s.trim());
      const sizeDocs = await Size.find({
        name: { $in: sizes },
        status: true,
      });

      if (sizeDocs.length === 0) {
        return res.status(404).json({
          success: false,
          error: `Size(s) '${size}' not found`,
        });
      }

      const sizeIds = sizeDocs.map((s) => s._id);
      filter.size_id = { $in: sizeIds };
    }

    const sortOptions = {};
    const sortFields = sort.split(",");

    sortFields.forEach((field) => {
      if (field.startsWith("-")) {
        sortOptions[field.substring(1)] = -1;
      } else {
        sortOptions[field] = 1;
      }
    });

    const skip = (parsedPage - 1) * parsedLimit;

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate({
          path: "category_id",
          select: "name type parent_id logo_url",
          match: { status: true },
        })
        .populate({
          path: "size_id",
          select: "name label measurements",
          match: { status: true },
        })
        .populate({
          path: "color_id",
          select: "name value hex",
          match: { status: true },
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / parsedLimit);
    const hasNextPage = parsedPage < totalPages;
    const hasPrevPage = parsedPage > 1;

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalProducts: totalCount,
        limit: parsedLimit,
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        name,
        parentcat,
        childcat,
        color,
        size,
        price,
        min_price,
        max_price,
        super_offer,
        status,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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
