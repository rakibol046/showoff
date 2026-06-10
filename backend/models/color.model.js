const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: String,
    },
    hex: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Color", colorSchema);
