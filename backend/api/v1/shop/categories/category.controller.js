const Category = require("../../../../models/category.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess, sendError } = require("../../../../utils/apiResponse");

exports.getCategoriesTree = asyncHandler(async (req, res) => {
  const parents = await Category.find({ type: 1, status: true })
    .select("name logo_url top note")
    .lean();

  const children = await Category.find({ type: 2, status: true })
    .select("name logo_url parent_id")
    .lean();

  const tree = parents.map((p) => ({
    ...p,
    children: children.filter((c) => c.parent_id?.toString() === p._id.toString()),
  }));

  return sendSuccess(res, tree, "Categories fetched");
});

exports.getTopCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ top: true, status: true })
    .select("name logo_url type parent_id")
    .lean();
  return sendSuccess(res, categories, "Top categories fetched");
});

exports.getParentCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ type: 1, status: true })
    .select("name logo_url")
    .lean();
  return sendSuccess(res, categories, "Parent categories fetched");
});
