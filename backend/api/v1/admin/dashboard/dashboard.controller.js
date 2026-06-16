const Product = require("../../../../models/product.model");
const { Order } = require("../../../../models/order.model");
const Customer = require("../../../../models/customer.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess } = require("../../../../utils/apiResponse");

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    totalOrders,
    totalCustomers,
    revenueResult,
    recentOrders,
    lowStockProducts,
    orderStatusCounts,
  ] = await Promise.all([
    Product.countDocuments({ status: true }),
    Order.countDocuments(),
    Customer.countDocuments({ status: true }),
    Order.aggregate([
      { $match: { payment_status: 1 } },
      { $group: { _id: null, total: { $sum: "$total_bill" } } },
    ]),
    Order.find()
      .populate({ path: "customer_id", select: "name phone" })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    Product.find({ stock: { $lte: 5 }, status: true })
      .select("name stock images sell_price")
      .sort({ stock: 1 })
      .limit(10)
      .lean(),
    Order.aggregate([
      { $group: { _id: "$order_status", count: { $sum: 1 } } },
    ]),
  ]);

  const totalRevenue = revenueResult[0]?.total || 0;

  const statusMap = { 0: "pending", 1: "processing", 2: "shipped", 3: "delivered", 4: "cancelled" };
  const orderStats = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
  orderStatusCounts.forEach(({ _id, count }) => {
    if (statusMap[_id]) orderStats[statusMap[_id]] = count;
  });

  return sendSuccess(res, {
    totalProducts,
    totalOrders,
    totalCustomers,
    totalRevenue,
    orderStats,
    recentOrders,
    lowStockProducts,
  }, "Dashboard stats fetched");
});
