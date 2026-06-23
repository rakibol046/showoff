const Size = require("../../../../models/size.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess, sendError } = require("../../../../utils/apiResponse");

exports.getSizes = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status !== undefined) filter.status = req.query.status === "true";
  const sizes = await Size.find(filter).sort({ createdAt: -1 }).lean();
  return sendSuccess(res, sizes, "Sizes fetched");
});

exports.getSize = asyncHandler(async (req, res) => {
  const s = await Size.findById(req.params.id).lean();
  if (!s) return sendError(res, 404, "Size not found");
  return sendSuccess(res, s, "Size fetched");
});

exports.createSize = asyncHandler(async (req, res) => {
  const { name, label, measurements, status } = req.body;
  if (!name) return sendError(res, 400, "Name is required");

  const parsedMeasurements = measurements
    ? (typeof measurements === "string" ? JSON.parse(measurements) : measurements)
    : {};

  const s = await Size.create({
    name, label, measurements: parsedMeasurements,
    status: status !== undefined ? status === "true" || status === true : true,
  });
  return sendSuccess(res, s, "Size created", null, 201);
});

exports.updateSize = asyncHandler(async (req, res) => {
  const { name, label, measurements, status } = req.body;
  const update = {};
  if (name !== undefined) update.name = name;
  if (label !== undefined) update.label = label;
  if (status !== undefined) update.status = status === "true" || status === true;
  if (measurements) {
    update.measurements = typeof measurements === "string" ? JSON.parse(measurements) : measurements;
  }

  const s = await Size.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!s) return sendError(res, 404, "Size not found");
  return sendSuccess(res, s, "Size updated");
});

exports.toggleStatus = asyncHandler(async (req, res) => {
  const s = await Size.findById(req.params.id);
  if (!s) return sendError(res, 404, "Size not found");
  s.status = !s.status;
  await s.save();
  return sendSuccess(res, { status: s.status }, "Size status toggled");
});

exports.deleteSize = asyncHandler(async (req, res) => {
  const s = await Size.findByIdAndDelete(req.params.id);
  if (!s) return sendError(res, 404, "Size not found");
  return sendSuccess(res, null, "Size deleted");
});

exports.bulkDeleteSizes = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) return sendError(res, 400, "IDs array is required");
  const result = await Size.deleteMany({ _id: { $in: ids } });
  return sendSuccess(res, { deleted: result.deletedCount }, "Sizes deleted");
});
