const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    type: {
      type: Number,
      required: true,
      enum: [1, 2], // 1: Parent, 2: Child
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    logo_url: {
      type: String,
      default: null,
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true, // Improves query performance
    },
  },
  { timestamps: true }
);

// Pre-save validation to ensure consistency
categorySchema.pre("save", function (next) {
  if (this.type === 1 && this.parent_id) {
    return next(new Error("Parent category cannot have a parent_id"));
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
