const Product = require("../../../models/product.model");
const Category = require("../../../models/category.model");
const Color = require("../../../models/color.model");
const Size = require("../../../models/size.model"); // ✅ Changed to size.model

exports.getProducts = async (req, res) => {
  try {
    const {
      name,
      parentcat,
      childcat,
      color,
      size,
      limit,
      price,
      super_offer,
      min_price,
      max_price,
    } = req.query;

    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
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
        return res.status(200).json({
          success: true,
          data: [],
          message: `Parent category '${parentcat}' not found`,
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
        return res.status(200).json({
          success: true,
          data: [],
          message: `Child category '${childcat}' not found`,
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
        return res.status(200).json({
          success: true,
          data: [],
          message: `Color(s) '${color}' not found`,
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
        return res.status(200).json({
          success: false,
          data: [],
          message: `Size(s) '${size}' not found`,
        });
      }

      const sizeIds = sizeDocs.map((s) => s._id);
      filter.size_id = { $in: sizeIds };
    }

    const parsedLimit = parseInt(limit) || 200;

    // const [products, totalCount] = await Promise.all([
    //   Product.find(filter)
    //     .populate({
    //       path: "category_id",
    //       select: "name type parent_id logo_url",
    //       match: { status: true },
    //     })
    //     .populate({
    //       path: "size_id",
    //       select: "name label measurements",
    //       match: { status: true },
    //     })
    //     .populate({
    //       path: "color_id",
    //       select: "name value hex",
    //       // match: { status: true },
    //     })
    //     .sort({ createdAt: -1 })
    //     .limit(parsedLimit)
    //     .lean(),
    //   Product.countDocuments(filter),
    // ]);
    const products = await Product.aggregate([
      { $match: filter },

      // CATEGORY (single)
      // {
      //   $lookup: {
      //     from: "categories",
      //     localField: "category_id",
      //     foreignField: "_id",
      //     as: "categories",
      //     pipeline: [
      //       { $match: { status: true } },
      //       { $project: { name: 1, type: 1, parent_id: 1, logo_url: 1 } },
      //     ],
      //   },
      // },

      // SIZES (multiple)
      // {
      //   $lookup: {
      //     from: "sizes",
      //     localField: "size_id",
      //     foreignField: "_id",
      //     as: "sizes",
      //     pipeline: [
      //       { $match: { status: true } },
      //       { $project: { name: 1, label: 1, measurements: 1 } },
      //     ],
      //   },
      // },

      // COLORS (multiple)
      // {
      //   $lookup: {
      //     from: "colors",
      //     localField: "color_id",
      //     foreignField: "_id",
      //     as: "colors",
      //     pipeline: [{ $project: { name: 1, value: 1, hex: 1 } }],
      //   },
      // },

      // SORT + PAGINATION
      { $sort: { createdAt: -1 } },
      { $limit: parsedLimit },

      // REMOVE RAW IDS
      {
        $project: {
          category_id: 0,
          size_id: 0,
          color_id: 0,
          buy_price: 0,
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    ]);
    const totalCount = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      totalProducts: totalCount,
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
// exports.getProducts = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit);

//     if (req.query.limit && (isNaN(limit) || limit < 1)) {
//       return res.status(400).json({
//         error: "Invalid limit parameter. Must be a positive number.",
//       });
//     }

//     const products = await Product.find().limit(limit);
//     // .populate("category_id product_size.size product_color");
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: "❌ Failed to fetch products", error });
//   }
// };

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
      {
        $lookup: {
          from: "colors",
          let: { color_id: "$color_id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$color_id"] },
              },
            },
            {
              $project: {
                name: 1,
                value: 1,
                hex: 1,
              },
            },
          ],
          as: "colors",
        },
      },
      {
        $lookup: {
          from: "sizes",
          let: { size_id: "$size_id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$size_id"] },
              },
            },
            {
              $project: {
                name: 1,
                value: 1,
                hex: 1,
              },
            },
          ],
          as: "sizes",
        },
      },
    ]);
    res.status(200).json({
      ...product[0],
      rating: 4.8,
      reviews: 256,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to fetch products", error });
  }
};
