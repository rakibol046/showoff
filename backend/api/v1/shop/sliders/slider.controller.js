const Slider = require("../../../../models/slider.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess } = require("../../../../utils/apiResponse");

exports.getSliders = asyncHandler(async (req, res) => {
  const sliders = await Slider.find({ status: true })
    .select("name image link")
    .lean();
  return sendSuccess(res, sliders, "Sliders fetched");
});
