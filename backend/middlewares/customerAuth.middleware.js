const jwt = require("jsonwebtoken");
const Customer = require("../models/customer.model");
const asyncHandler = require("./asyncHandler");

const customerAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const customer = await Customer.findOne({ _id: decoded.id, status: true }).select("-password");
  if (!customer) {
    return res.status(401).json({ success: false, message: "Customer not found or inactive" });
  }

  req.customer = customer;
  next();
});

module.exports = customerAuth;
