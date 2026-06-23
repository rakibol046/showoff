const Category = require("../../../../models/category.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess, sendError } = require("../../../../utils/apiResponse");

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.aggregate([
    { $match: { type: 1, status: true } },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "parent_id",
        as: "children",
        pipeline: [
          { $match: { status: true } },
          {
            $lookup: {
              from: "categories",
              localField: "_id",
              foreignField: "parent_id",
              as: "children",
              pipeline: [
                { $match: { status: true } },
                { $project: { name: 1, logo_url: 1 } },
              ],
            },
          },
          { $project: { name: 1, logo_url: 1, children: 1 } },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
    { $project: { name: 1, logo_url: 1, top: 1, note: 1, children: 1 } },
  ]);
  return sendSuccess(res, categories, "Categories fetched");
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
