const slugify = require("slugify");
const Product = require("../../../../models/product.model");
const Category = require("../../../../models/category.model");
const Color = require("../../../../models/color.model");
const Size = require("../../../../models/size.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess, sendError } = require("../../../../utils/apiResponse");

exports.getProducts = asyncHandler(async (req, res) => {
  const {
    name, parentcat, childcat, color, size,
    limit = 10, page = 1, price, sort = "-createdAt",
    super_offer, status, min_price, max_price, stock,
  } = req.query;

  const parsedLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const parsedPage = Math.max(parseInt(page) || 1, 1);
  const filter = {};

  if (name) filter.name = { $regex: name, $options: "i" };
  if (status !== undefined && status !== "all") filter.status = status === "true";
  if (super_offer !== undefined) filter.super_offer = super_offer === "true";

  if (min_price || max_price) {
    filter.sell_price = {};
    if (min_price) filter.sell_price.$gte = parseFloat(min_price);
    if (max_price) filter.sell_price.$lte = parseFloat(max_price);
  } else if (price) {
    filter.sell_price = parseFloat(price);
  }

  if (stock === "out") filter.stock = { $lte: 0 };
  else if (stock === "in") filter.stock = { $gt: 0 };

  if (parentcat) {
    const parentCategory = await Category.findOne({ name: parentcat, type: 1 });
    if (!parentCategory) return sendError(res, 404, `Parent category '${parentcat}' not found`);
    const children = await Category.find({ parent_id: parentCategory._id });
    const childIds = children.map((c) => c._id);
    const subChildren = await Category.find({ parent_id: { $in: childIds } });
    filter.category_id = { $in: [parentCategory._id, ...childIds, ...subChildren.map((c) => c._id)] };
  }

  if (childcat) {
    const childCategory = await Category.findOne({ name: childcat, type: 2 });
    if (!childCategory) return sendError(res, 404, `Child category '${childcat}' not found`);
    const subChildren = await Category.find({ parent_id: childCategory._id });
    const ids = [childCategory._id, ...subChildren.map((c) => c._id)];
    filter.category_id = filter.category_id
      ? { $in: filter.category_id.$in.filter((id) => ids.some((i) => i.equals(id))) }
      : { $in: ids };
  }

  if (color) {
    const colorDocs = await Color.find({ name: { $in: color.split(",").map((c) => c.trim()) } });
    if (!colorDocs.length) return sendError(res, 404, `Color(s) '${color}' not found`);
    filter.color_id = { $in: colorDocs.map((c) => c._id) };
  }

  if (size) {
    const sizeDocs = await Size.find({ name: { $in: size.split(",").map((s) => s.trim()) } });
    if (!sizeDocs.length) return sendError(res, 404, `Size(s) '${size}' not found`);
    filter.size_id = { $in: sizeDocs.map((s) => s._id) };
  }

  const sortOptions = {};
  sort.split(",").forEach((f) => {
    if (f.startsWith("-")) sortOptions[f.slice(1)] = -1;
    else sortOptions[f] = 1;
  });

  const skip = (parsedPage - 1) * parsedLimit;
  const [products, totalCount] = await Promise.all([
    Product.find(filter)
      .populate({ path: "category_id", select: "name type parent_id logo_url" })
      .populate({ path: "size_id", select: "name label measurements" })
      .populate({ path: "color_id", select: "name value hex" })
      .sort(sortOptions).skip(skip).limit(parsedLimit).lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / parsedLimit);
  return sendSuccess(res, products, "Products fetched", {
    currentPage: parsedPage, totalPages,
    total: totalCount, limit: parsedLimit,
    hasNextPage: parsedPage < totalPages,
    hasPrevPage: parsedPage > 1,
  });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate({ path: "category_id", select: "name type" })
    .populate({ path: "size_id", select: "name label measurements" })
    .populate({ path: "color_id", select: "name value hex" })
    .lean();
  if (!product) return sendError(res, 404, "Product not found");
  return sendSuccess(res, product, "Product fetched");
});

exports.createProduct = asyncHandler(async (req, res) => {
  const {
    name, product_code, bar_code, buy_price, sell_price, discount,
    stock, category_id, size_id, color_id, description, super_offer, status,
  } = req.body;

  if (!name) return sendError(res, 400, "Product name is required");

  const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
  const slug = slugify(name, { lower: true, strict: true, replacement: "-" });

  const existing = await Product.findOne({ slug });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const parseIds = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return val.split(",").map((v) => v.trim()).filter(Boolean); }
  };

  const product = await Product.create({
    name, product_code, bar_code,
    buy_price: parseFloat(buy_price) || 0,
    sell_price: parseFloat(sell_price) || 0,
    discount: parseFloat(discount) || 0,
    stock: parseInt(stock) || 1,
    category_id: parseIds(category_id),
    size_id: parseIds(size_id),
    color_id: parseIds(color_id),
    description, images, slug: finalSlug,
    super_offer: super_offer === "true" || super_offer === true,
    status: status !== "false" && status !== false,
  });
  return sendSuccess(res, product, "Product created", null, 201);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const {
    name, product_code, bar_code, buy_price, sell_price, discount,
    stock, category_id, size_id, color_id, description, super_offer, status, existingImages,
  } = req.body;

  const update = {};
  if (name !== undefined) {
    update.name = name;
    update.slug = slugify(name, { lower: true, strict: true, replacement: "-" });
  }
  if (product_code !== undefined) update.product_code = product_code;
  if (bar_code !== undefined) update.bar_code = bar_code;
  if (buy_price !== undefined) update.buy_price = parseFloat(buy_price);
  if (sell_price !== undefined) update.sell_price = parseFloat(sell_price);
  if (discount !== undefined) update.discount = parseFloat(discount);
  if (stock !== undefined) update.stock = parseInt(stock);
  if (description !== undefined) update.description = description;
  if (super_offer !== undefined) update.super_offer = super_offer === "true" || super_offer === true;
  if (status !== undefined) update.status = status !== "false" && status !== false;

  const parseIds = (val) => {
    if (!val) return undefined;
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return val.split(",").map((v) => v.trim()).filter(Boolean); }
  };

  const catIds = parseIds(category_id);
  const sizeIds = parseIds(size_id);
  const colorIds = parseIds(color_id);
  if (catIds) update.category_id = catIds;
  if (sizeIds) update.size_id = sizeIds;
  if (colorIds) update.color_id = colorIds;

  // Merge existing images with new uploads
  const newImages = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
  let kept = [];
  if (existingImages) {
    try { kept = JSON.parse(existingImages); } catch { kept = Array.isArray(existingImages) ? existingImages : [existingImages]; }
  }
  if (newImages.length || kept.length) update.images = [...kept, ...newImages];

  const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!product) return sendError(res, 404, "Product not found");
  return sendSuccess(res, product, "Product updated");
});

exports.toggleProductStatus = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return sendError(res, 404, "Product not found");
  product.status = !product.status;
  await product.save();
  return sendSuccess(res, { status: product.status }, "Product status toggled");
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return sendError(res, 404, "Product not found");
  return sendSuccess(res, null, "Product deleted");
});
