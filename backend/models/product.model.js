const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

// Variant Schema
const variantSchema = new Schema(
  {
    size: {
      type: Schema.Types.ObjectId,
      ref: "ProductSize",
    },
    color: {
      type: Schema.Types.ObjectId,
      ref: "Color",
    },
    sell_price: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

// Product Schema
const productSchema = new Schema(
  {
    product_code: { type: String, default: "" },
    bar_code: { type: String, default: "" },
    name: { type: String, required: true },
    status: { type: Boolean, default: true },
    thumbnail: { type: String, default: null },
    product_images: [{ type: String }],
    product_video: { type: String, default: "" },
    buy_price: { type: Number, default: 0 },
    sell_price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    category_id: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    description: { type: String, default: null },
    super_offer: { type: Boolean, default: false },
    slug: { type: String, default: "" },

    // Variants
    variants: [variantSchema],
  },
  { timestamps: true }
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
