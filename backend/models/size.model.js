const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    label: {
      type: String,
    },
    measurements: {
      chest: {
        type: Number,
      },
      waist: {
        type: Number,
      },
      length: {
        type: Number,
      },
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Size", sizeSchema);
