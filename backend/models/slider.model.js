const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sliderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: null,
    },
    link: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slider", sliderSchema);
