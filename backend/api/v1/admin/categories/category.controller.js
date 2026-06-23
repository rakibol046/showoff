const Category = require("../../../../models/category.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess, sendError } = require("../../../../utils/apiResponse");

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.aggregate([
    { $match: { type: 1 } },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "parent_id",
        as: "children",
        pipeline: [
          {
            $lookup: {
              from: "categories",
              localField: "_id",
              foreignField: "parent_id",
              as: "children",
            },
          },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  return sendSuccess(res, categories, "Categories fetched");
});

exports.getParentCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ type: 1 }).sort({ createdAt: -1 }).lean();
  return sendSuccess(res, categories, "Parent categories fetched");
});

exports.getTopCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ top: true, status: true }).lean();
  return sendSuccess(res, categories, "Top categories fetched");
});

exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate("parent_id", "name type").lean();
  if (!category) return sendError(res, 404, "Category not found");

  const children = await Category.find({ parent_id: category._id }).lean();
  return sendSuccess(res, { ...category, children }, "Category fetched");
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { type, name, parent_id, note, status, top } = req.body;
  const logo_url = req.file ? `/uploads/${req.file.filename}` : "";

  const category = await Category.create({
    type: Number(type) || 1,
    name,
    parent_id: parent_id || null,
    note,
    status: status !== undefined ? status === "true" || status === true : true,
    top: top === "true" || top === true,
    logo_url,
  });
  return sendSuccess(res, category, "Category created", null, 201);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const { name, status, note, top } = req.body;
  const update = {};
  if (name !== undefined) update.name = name;
  if (status !== undefined) update.status = status === "true" || status === true;
  if (note !== undefined) update.note = note;
  if (top !== undefined) update.top = top === "true" || top === true;
  if (req.file) update.logo_url = `/uploads/${req.file.filename}`;

  const category = await Category.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!category) return sendError(res, 404, "Category not found");
  return sendSuccess(res, category, "Category updated");
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return sendError(res, 404, "Category not found");

  const children = await Category.find({ parent_id: category._id });
  const childIds = children.map((c) => c._id);
  await Category.deleteMany({ parent_id: { $in: childIds } });
  await Category.deleteMany({ parent_id: category._id });
  await Category.findByIdAndDelete(req.params.id);

  return sendSuccess(res, null, "Category and its children deleted");
});
