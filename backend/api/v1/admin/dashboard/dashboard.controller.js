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

exports.getSalesReport = asyncHandler(async (req, res) => {
  const now = new Date();

  // ── Weekly: last 14 days so we can compute week-over-week trend ──
  const day14Ago = new Date(now);
  day14Ago.setDate(now.getDate() - 13);
  day14Ago.setHours(0, 0, 0, 0);

  const dailyRaw = await Order.aggregate([
    { $match: { createdAt: { $gte: day14Ago } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: { $cond: [{ $eq: ["$payment_status", 1] }, "$total_bill", 0] } },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Fill every day in the 14-day window
  const dailyMap = Object.fromEntries(dailyRaw.map((d) => [d._id, d]));
  const allDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(day14Ago);
    d.setDate(day14Ago.getDate() + i);
    const key = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    return { date: key, label, revenue: dailyMap[key]?.revenue || 0, orders: dailyMap[key]?.orders || 0 };
  });

  const thisWeek = allDays.slice(7);
  const lastWeek = allDays.slice(0, 7);
  const weekRevenue = thisWeek.reduce((s, d) => s + d.revenue, 0);
  const lastWeekRevenue = lastWeek.reduce((s, d) => s + d.revenue, 0);
  const weekOrders = thisWeek.reduce((s, d) => s + d.orders, 0);
  const lastWeekOrders = lastWeek.reduce((s, d) => s + d.orders, 0);

  // ── Monthly: last 24 months for month-over-month trend ──
  const month24Ago = new Date(now.getFullYear(), now.getMonth() - 23, 1);

  const monthlyRaw = await Order.aggregate([
    { $match: { createdAt: { $gte: month24Ago } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        revenue: { $sum: { $cond: [{ $eq: ["$payment_status", 1] }, "$total_bill", 0] } },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const monthlyMap = Object.fromEntries(monthlyRaw.map((m) => [m._id, m]));
  const allMonths = Array.from({ length: 24 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 23 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return { month: key, label, revenue: monthlyMap[key]?.revenue || 0, orders: monthlyMap[key]?.orders || 0 };
  });

  const thisMonth = allMonths[allMonths.length - 1];
  const lastMonth = allMonths[allMonths.length - 2];

  return sendSuccess(res, {
    weekly: {
      data: thisWeek,
      trend: {
        revenue: weekRevenue,
        revenuePrev: lastWeekRevenue,
        orders: weekOrders,
        ordersPrev: lastWeekOrders,
      },
    },
    monthly: {
      data: allMonths.slice(-12),
      trend: {
        revenue: thisMonth.revenue,
        revenuePrev: lastMonth.revenue,
        orders: thisMonth.orders,
        ordersPrev: lastMonth.orders,
      },
    },
  }, "Sales report fetched");
});
