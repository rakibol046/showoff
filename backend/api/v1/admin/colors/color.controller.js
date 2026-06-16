const Color = require("../../../../models/color.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess, sendError } = require("../../../../utils/apiResponse");

const HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

exports.getColors = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status !== undefined) filter.status = req.query.status === "true";
  const colors = await Color.find(filter).sort({ createdAt: -1 }).lean();
  return sendSuccess(res, colors, "Colors fetched");
});

exports.getColor = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id).lean();
  if (!color) return sendError(res, 404, "Color not found");
  return sendSuccess(res, color, "Color fetched");
});

exports.createColor = asyncHandler(async (req, res) => {
  const { name, value, hex, status } = req.body;
  if (!name) return sendError(res, 400, "Name is required");
  if (!hex) return sendError(res, 400, "Hex color is required");
  if (!HEX_REGEX.test(hex)) return sendError(res, 400, "Invalid hex color format");

  const color = await Color.create({
    name, value, hex,
    status: status !== undefined ? status === "true" || status === true : true,
  });
  return sendSuccess(res, color, "Color created", null, 201);
});

exports.updateColor = asyncHandler(async (req, res) => {
  const { name, value, hex, status } = req.body;
  if (hex && !HEX_REGEX.test(hex)) return sendError(res, 400, "Invalid hex color format");

  const update = {};
  if (name !== undefined) update.name = name;
  if (value !== undefined) update.value = value;
  if (hex !== undefined) update.hex = hex;
  if (status !== undefined) update.status = status === "true" || status === true;

  const color = await Color.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!color) return sendError(res, 404, "Color not found");
  return sendSuccess(res, color, "Color updated");
});

exports.toggleStatus = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  if (!color) return sendError(res, 404, "Color not found");
  color.status = !color.status;
  await color.save();
  return sendSuccess(res, { status: color.status }, "Color status toggled");
});

exports.deleteColor = asyncHandler(async (req, res) => {
  const color = await Color.findByIdAndDelete(req.params.id);
  if (!color) return sendError(res, 404, "Color not found");
  return sendSuccess(res, null, "Color deleted");
});

exports.bulkDeleteColors = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) return sendError(res, 400, "IDs array is required");
  const result = await Color.deleteMany({ _id: { $in: ids } });
  return sendSuccess(res, { deleted: result.deletedCount }, "Colors deleted");
});
