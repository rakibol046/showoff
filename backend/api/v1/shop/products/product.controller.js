const Product = require("../../../../models/product.model");
const Category = require("../../../../models/category.model");
const Color = require("../../../../models/color.model");
const Size = require("../../../../models/size.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess, sendError } = require("../../../../utils/apiResponse");

exports.getProducts = asyncHandler(async (req, res) => {
  const {
    name, parentcat, childcat, subcat, color, size,
    min_price, max_price, super_offer,
    page = 1, limit = 20,
  } = req.query;

  const filter = { status: true };

  if (name) filter.name = { $regex: name, $options: "i" };
  if (super_offer !== undefined) filter.super_offer = super_offer === "true";
  if (min_price || max_price) {
    filter.sell_price = {};
    if (min_price) filter.sell_price.$gte = parseFloat(min_price);
    if (max_price) filter.sell_price.$lte = parseFloat(max_price);
  }

  if (parentcat) {
    const parent = await Category.findOne({ name: parentcat, type: 1, status: true });
    if (!parent) return sendSuccess(res, [], "Products fetched", { total: 0, page: 1, limit: 20, totalPages: 0 });

    const children = await Category.find({ parent_id: parent._id, status: true });
    const childIds = children.map((c) => c._id);
    const subChildren = await Category.find({ parent_id: { $in: childIds }, status: true });
    const subChildIds = subChildren.map((c) => c._id);

    filter.category_id = { $in: [parent._id, ...childIds, ...subChildIds] };
  }

  if (childcat) {
    const child = await Category.findOne({ name: childcat, type: 2, status: true });
    if (!child) return sendSuccess(res, [], "Products fetched", { total: 0, page: 1, limit: 20, totalPages: 0 });

    const subs = await Category.find({ parent_id: child._id, status: true });
    const ids = [child._id, ...subs.map((s) => s._id)];
    filter.category_id = filter.category_id
      ? { $in: filter.category_id.$in.filter((id) => ids.some((i) => i.equals(id))) }
      : { $in: ids };
  }

  if (subcat) {
    const subcatNames = Array.isArray(subcat) ? subcat : [subcat];
    const subDocs = await Category.find({ name: { $in: subcatNames }, type: 3, status: true });
    if (!subDocs.length) return sendSuccess(res, [], "Products fetched", { total: 0, page: 1, limit: 20, totalPages: 0 });
    filter.category_id = { $in: subDocs.map((s) => s._id) };
  }

  if (color) {
    const colorDocs = await Color.find({ name: { $in: color.split(",").map((c) => c.trim()) }, status: true });
    if (!colorDocs.length) return sendSuccess(res, [], "Products fetched", { total: 0, page: 1, limit: 20, totalPages: 0 });
    filter.color_id = { $in: colorDocs.map((c) => c._id) };
  }

  if (size) {
    const sizeDocs = await Size.find({ name: { $in: size.split(",").map((s) => s.trim()) }, status: true });
    if (!sizeDocs.length) return sendSuccess(res, [], "Products fetched", { total: 0, page: 1, limit: 20, totalPages: 0 });
    filter.size_id = { $in: sizeDocs.map((s) => s._id) };
  }

  const parsedLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
  const parsedPage = Math.max(parseInt(page) || 1, 1);
  const skip = (parsedPage - 1) * parsedLimit;

  const [products, total] = await Promise.all([
    Product.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parsedLimit },
      {
        $lookup: {
          from: "colors", localField: "color_id", foreignField: "_id", as: "colors",
          pipeline: [{ $project: { _id: 0, name: 1, hex: 1 } }],
        },
      },
      {
        $lookup: {
          from: "sizes", localField: "size_id", foreignField: "_id", as: "sizes",
          pipeline: [{ $project: { _id: 0, name: 1 } }],
        },
      },
      {
        $project: {
          _id: 1, slug: 1, name: 1, sell_price: 1, discount: 1,
          stock: 1, super_offer: 1, colors: 1, sizes: 1,
          image: { $arrayElemAt: ["$images", 0] },
        },
      },
    ]),
    Product.countDocuments(filter),
  ]);

  return sendSuccess(res, products, "Products fetched", {
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
    hasNextPage: parsedPage < Math.ceil(total / parsedLimit),
    hasPrevPage: parsedPage > 1,
  });
});

exports.getProductBySlug = asyncHandler(async (req, res) => {
  const [product] = await Product.aggregate([
    { $match: { slug: req.params.slug, status: true } },
    {
      $lookup: {
        from: "categories", localField: "category_id", foreignField: "_id", as: "categories",
        pipeline: [{ $project: { _id: 0, name: 1, type: 1 } }],
      },
    },
    {
      $lookup: {
        from: "colors", localField: "color_id", foreignField: "_id", as: "colors",
        pipeline: [{ $project: { name: 1, hex: 1 } }],
      },
    },
    {
      $lookup: {
        from: "sizes", localField: "size_id", foreignField: "_id", as: "sizes",
        pipeline: [{ $project: { name: 1, label: 1 } }],
      },
    },
    {
      $project: {
        _id: 1, slug: 1, name: 1, sell_price: 1, discount: 1, stock: 1,
        super_offer: 1, images: 1, video: 1, description: 1, product_code: 1,
        categories: 1, colors: 1, sizes: 1,
      },
    },
  ]);

  if (!product) return sendError(res, 404, "Product not found");
  return sendSuccess(res, product, "Product fetched");
});
