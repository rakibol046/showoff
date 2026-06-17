const { Order } = require("../../../../models/order.model");
const Product = require("../../../../models/product.model");
const Settings = require("../../../../models/settings.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess, sendError } = require("../../../../utils/apiResponse");
const { sendMail } = require("../../../../services/email.service");
const { orderConfirmationEmail } = require("../../../../utils/emailTemplates");

exports.placeOrder = asyncHandler(async (req, res) => {
  const {
    receiver_name, receiver_phone, receiver_email,
    receiver_location, products, delivery_charge = 0,
    payment_method = "cash", delivery_type = "home",
  } = req.body;

  if (!receiver_name) return sendError(res, 400, "Receiver name is required");
  if (!receiver_phone) return sendError(res, 400, "Receiver phone is required");
  if (!Array.isArray(products) || !products.length) return sendError(res, 400, "At least one product is required");

  const productIds = products.map((p) => p.product_id);
  const productDocs = await Product.find({ _id: { $in: productIds }, status: true }).lean();

  const products_list = products.map((p) => {
    const doc = productDocs.find((d) => d._id.toString() === p.product_id);
    if (!doc) throw new Error(`Product ${p.product_id} not found`);
    return {
      product_id: doc._id,
      product_name: doc.name,
      product_code: doc.product_code || "",
      product_buy_price: doc.buy_price || 0,
      product_price: doc.sell_price || 0,
      product_quantity: Math.max(parseInt(p.quantity) || 1, 1),
    };
  });

  const sub_total = products_list.reduce((sum, p) => sum + p.product_price * p.product_quantity, 0);
  const delCharge = parseFloat(delivery_charge) || 0;
  const total_bill = sub_total + delCharge;

  const count = await Order.countDocuments();
  const order_id = `ORD-${String(count + 1).padStart(6, "0")}`;

  const order = await Order.create({
    order_id,
    products_list,
    sub_total,
    discount: 0,
    delivery_charge: delCharge,
    total_bill,
    total_payment: 0,
    total_due: total_bill,
    receiver_name,
    receiver_phone,
    receiver_email: receiver_email || null,
    receiver_location: receiver_location || null,
    customer_id: req.customer?._id || null,
    payment_method,
    payment_status: 0,
    delivery_type,
    order_status: 0,
    order_date: new Date().toISOString().split("T")[0],
  });

  if (order.receiver_email) {
    const settings = await Settings.findOne().lean();
    const { subject, html } = orderConfirmationEmail(order, settings);
    sendMail({ to: order.receiver_email, subject, html });
  }

  return sendSuccess(res, {
    order_id: order.order_id,
    _id: order._id,
    total_bill: order.total_bill,
    order_status: order.order_status,
  }, "Order placed successfully", null, 201);
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const parsedLimit = Math.min(parseInt(limit) || 10, 50);
  const parsedPage = Math.max(parseInt(page) || 1, 1);
  const skip = (parsedPage - 1) * parsedLimit;

  const filter = { customer_id: req.customer._id };
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .select("order_id order_status payment_status total_bill order_date products_list")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return sendSuccess(res, orders, "Orders fetched", {
    total, page: parsedPage, limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  });
});

exports.getMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, customer_id: req.customer._id }).lean();
  if (!order) return sendError(res, 404, "Order not found");
  return sendSuccess(res, order, "Order fetched");
});
