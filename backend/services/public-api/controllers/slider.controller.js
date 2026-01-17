const Slider = require("../../../models/slider.model");

exports.getSliders = async (req, res) => {
  try {
    const Sliders = await Slider.find();
    res.status(200).json(Sliders);
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to fetch Sliders", error });
  }
};
