const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    order_id: {
      type: String,
      required: true,
    },
    products_list: [
      {
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        product_name: { type: String, required: true },
        product_code: { type: String },
        product_buy_price: { type: Number, required: true },
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true },
        procut_color: { type: Schema.Types.ObjectId, ref: "Color" },
      },
    ],
    sub_total: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total_bill: {
      type: Number,
      required: true,
    },
    total_payment: {
      type: Number,
      default: 0,
    },
    total_due: {
      type: Number,
      default: 0,
    },
    delivery_charge: {
      type: Number,
      default: 0,
    },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    receiver_name: { type: String, default: null },
    receiver_phone: { type: String, default: null },
    receiver_location: { type: String, default: null },

    order_date: { type: String, default: null },
    received_time: { type: String, default: null },

    order_status: {
      type: Number,
      default: 0,
    },
    payment_method: {
      type: String,
      default: null,
    },
    payment_status: {
      type: Number,
      default: 1,
    },
    delivery_type: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

exports.Order = mongoose.model("Order", orderSchema);
