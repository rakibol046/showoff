const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

// Product Schema
const productSchema = new Schema(
  {
    product_code: { type: String, default: "" },
    bar_code: { type: String, default: "" },
    name: { type: String, required: true },
    status: { type: Boolean, default: true },
    images: [{ type: String }],
    video: { type: String, default: "" },
    buy_price: { type: Number, default: 0 },
    sell_price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    stock: { type: Number, default: 1 },
    category_id: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    size_id: [{ type: Schema.Types.ObjectId, ref: "Size" }],
    color_id: [{ type: Schema.Types.ObjectId, ref: "Color" }],
    description: { type: String, default: null },
    super_offer: { type: Boolean, default: false },
    slug: { type: String, unique: true, required: true },
  },
  { timestamps: true },
);

// Auto-generate slug from name
productSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      replacement: "-",
    });
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
