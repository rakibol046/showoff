const { Order } = require("../../../../models/order.model");
const Product = require("../../../../models/product.model");
const Settings = require("../../../../models/settings.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess, sendError } = require("../../../../utils/apiResponse");
const { sendMail } = require("../../../../services/email.service");
const { orderConfirmationEmail, orderStatusUpdateEmail } = require("../../../../utils/emailTemplates");

// order_status: 0=Pending, 1=Processing, 2=Shipped, 3=Delivered, 4=Cancelled
// payment_status: 0=Unpaid, 1=Paid, 2=Partial

exports.getOrders = asyncHandler(async (req, res) => {
  const { status, payment_status, limit = 20, page = 1, search } = req.query;
  const parsedLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
  const parsedPage = Math.max(parseInt(page) || 1, 1);

  const filter = {};
  if (status !== undefined) filter.order_status = parseInt(status);
  if (payment_status !== undefined) filter.payment_status = parseInt(payment_status);
  if (search) {
    filter.$or = [
      { order_id: { $regex: search, $options: "i" } },
      { receiver_name: { $regex: search, $options: "i" } },
      { receiver_phone: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parsedPage - 1) * parsedLimit;
  const [orders, totalCount] = await Promise.all([
    Order.find(filter)
      .populate({ path: "customer_id", select: "name email phone" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / parsedLimit);
  return sendSuccess(res, orders, "Orders fetched", {
    currentPage: parsedPage, totalPages, total: totalCount, limit: parsedLimit,
    hasNextPage: parsedPage < totalPages, hasPrevPage: parsedPage > 1,
  });
});

exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate({ path: "customer_id", select: "name email phone address" })
    .populate({ path: "products_list.product_id", select: "name images slug" })
    .populate({ path: "products_list.procut_color", select: "name hex" })
    .lean();
  if (!order) return sendError(res, 404, "Order not found");
  return sendSuccess(res, order, "Order fetched");
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { order_status } = req.body;
  if (order_status === undefined) return sendError(res, 400, "order_status is required");
  const status = parseInt(order_status);
  if (![0, 1, 2, 3, 4].includes(status)) return sendError(res, 400, "Invalid order status (0-4)");

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { order_status: status },
    { new: true }
  );
  if (!order) return sendError(res, 404, "Order not found");

  const emailAddress = order.receiver_email || order.customer_id?.email;
  if (emailAddress) {
    const settings = await Settings.findOne().lean();
    const { subject, html } = orderStatusUpdateEmail(order, status, settings);
    sendMail({ to: emailAddress, subject, html });
  }

  return sendSuccess(res, { order_status: order.order_status }, "Order status updated");
});

exports.updatePaymentStatus = asyncHandler(async (req, res) => {
  const { payment_status, total_payment } = req.body;
  if (payment_status === undefined) return sendError(res, 400, "payment_status is required");
  const status = parseInt(payment_status);
  if (![0, 1, 2].includes(status)) return sendError(res, 400, "Invalid payment status (0-2)");

  const existing = await Order.findById(req.params.id).lean();
  if (!existing) return sendError(res, 404, "Order not found");

  const update = { payment_status: status };

  if (status === 1) {
    // Fully paid — clear due
    update.total_payment = existing.total_bill;
    update.total_due = 0;
  } else if (status === 0) {
    // Unpaid — reset
    update.total_payment = 0;
    update.total_due = existing.total_bill;
  } else {
    // Partial — use provided amount
    const paid = total_payment !== undefined ? parseFloat(total_payment) : existing.total_payment;
    update.total_payment = paid;
    update.total_due = Math.max(existing.total_bill - paid, 0);
  }

  const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
  return sendSuccess(res, {
    payment_status: order.payment_status,
    total_payment: order.total_payment,
    total_due: order.total_due,
  }, "Payment status updated");
});

exports.createOrder = asyncHandler(async (req, res) => {
  const {
    receiver_name,
    receiver_phone,
    receiver_email,
    receiver_location,
    products,
    discount = 0,
    delivery_charge = 0,
    payment_method = "cash",
    payment_status = 0,
    delivery_type = "home",
    order_status = 0,
    total_payment = 0,
  } = req.body;

  if (!receiver_name) return sendError(res, 400, "Receiver name is required");
  if (!receiver_phone) return sendError(res, 400, "Receiver phone is required");
  if (!Array.isArray(products) || !products.length) return sendError(res, 400, "At least one product is required");

  const productIds = products.map((p) => p.product_id);
  const productDocs = await Product.find({ _id: { $in: productIds } }).lean();

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
  const disc = parseFloat(discount) || 0;
  const delCharge = parseFloat(delivery_charge) || 0;
  const paid = parseFloat(total_payment) || 0;
  const total_bill = sub_total + delCharge - disc;
  const total_due = Math.max(total_bill - paid, 0);

  const count = await Order.countDocuments();
  const order_id = `ORD-${String(count + 1).padStart(6, "0")}`;

  const order = await Order.create({
    order_id,
    products_list,
    sub_total,
    discount: disc,
    delivery_charge: delCharge,
    total_bill,
    total_payment: paid,
    total_due,
    receiver_name,
    receiver_phone,
    receiver_email: receiver_email || null,
    receiver_location: receiver_location || null,
    payment_method,
    payment_status: parseInt(payment_status),
    delivery_type,
    order_status: parseInt(order_status),
    order_date: new Date().toISOString().split("T")[0],
  });

  if (order.receiver_email) {
    const settings = await Settings.findOne().lean();
    const { subject, html } = orderConfirmationEmail(order, settings);
    sendMail({ to: order.receiver_email, subject, html });
  }

  return sendSuccess(res, order, "Order created", null, 201);
});
