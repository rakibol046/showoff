const Slider = require("../../../../models/slider.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess, sendError } = require("../../../../utils/apiResponse");

exports.getSliders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status !== undefined) filter.status = req.query.status === "true";
  const sliders = await Slider.find(filter).sort({ createdAt: -1 }).lean();
  return sendSuccess(res, sliders, "Sliders fetched");
});

exports.getSlider = asyncHandler(async (req, res) => {
  const slider = await Slider.findById(req.params.id).lean();
  if (!slider) return sendError(res, 404, "Slider not found");
  return sendSuccess(res, slider, "Slider fetched");
});

exports.createSlider = asyncHandler(async (req, res) => {
  const { name, link, status } = req.body;
  if (!name) return sendError(res, 400, "Slider name is required");
  const image = req.file ? `/uploads/${req.file.filename}` : "";
  const slider = await Slider.create({
    name, link, image,
    status: status !== undefined ? status === "true" || status === true : true,
  });
  return sendSuccess(res, slider, "Slider created", null, 201);
});

exports.updateSlider = asyncHandler(async (req, res) => {
  const { name, link, status } = req.body;
  const update = {};
  if (name !== undefined) update.name = name;
  if (link !== undefined) update.link = link;
  if (status !== undefined) update.status = status === "true" || status === true;
  if (req.file) update.image = `/uploads/${req.file.filename}`;

  const slider = await Slider.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!slider) return sendError(res, 404, "Slider not found");
  return sendSuccess(res, slider, "Slider updated");
});

exports.toggleStatus = asyncHandler(async (req, res) => {
  const slider = await Slider.findById(req.params.id);
  if (!slider) return sendError(res, 404, "Slider not found");
  slider.status = !slider.status;
  await slider.save();
  return sendSuccess(res, { status: slider.status }, "Slider status toggled");
});

exports.deleteSlider = asyncHandler(async (req, res) => {
  const slider = await Slider.findByIdAndDelete(req.params.id);
  if (!slider) return sendError(res, 404, "Slider not found");
  return sendSuccess(res, null, "Slider deleted");
});
