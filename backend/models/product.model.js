const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    product_code: {
      type: String,
      default: "",
    },
    bar_code: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    product_images: [
      {
        type: String,
      },
    ],
    product_video: {
      type: String,
      default: "",
    },
    buy_price: {
      type: Number,
      default: 0,
    },
    sell_price: {
      type: Number,
      required: true,
      default: 0,
    },
    category_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    product_size: [
      {
        size: {
          type: Schema.Types.ObjectId,
          ref: "ProductSize",
        },
        sell_price: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],

    product_color: [
      {
        type: Schema.Types.ObjectId,
        ref: "Color",
        default: "",
      },
    ],
    discount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      default: null,
    },
    super_offer: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
