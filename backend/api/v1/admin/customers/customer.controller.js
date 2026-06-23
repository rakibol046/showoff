const Customer = require("../../../../models/customer.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess, sendError } = require("../../../../utils/apiResponse");

exports.getCustomers = asyncHandler(async (req, res) => {
  const { search, status, limit = 20, page = 1 } = req.query;
  const parsedLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
  const parsedPage = Math.max(parseInt(page) || 1, 1);

  const filter = {};
  if (status !== undefined) filter.status = status === "true";
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parsedPage - 1) * parsedLimit;
  const [customers, totalCount] = await Promise.all([
    Customer.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(parsedLimit).lean(),
    Customer.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / parsedLimit);
  return sendSuccess(res, customers, "Customers fetched", {
    currentPage: parsedPage, totalPages, total: totalCount, limit: parsedLimit,
    hasNextPage: parsedPage < totalPages, hasPrevPage: parsedPage > 1,
  });
});

exports.getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id).select("-password").lean();
  if (!customer) return sendError(res, 404, "Customer not found");
  return sendSuccess(res, customer, "Customer fetched");
});

exports.toggleCustomerStatus = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return sendError(res, 404, "Customer not found");
  customer.status = !customer.status;
  await customer.save();
  return sendSuccess(res, { status: customer.status }, "Customer status toggled");
});
