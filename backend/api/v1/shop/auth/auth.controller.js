const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Customer = require("../../../../models/customer.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess, sendError } = require("../../../../utils/apiResponse");

const signToken = (id, phone) =>
  jwt.sign({ id, phone }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = asyncHandler(async (req, res) => {
  console.log("Registering customer with data:", req.body);
  const { name, phone, email, password } = req.body;
  if (!name || !phone || !password) return sendError(res, 400, "Name, phone, and password are required");

  const existing = await Customer.findOne({ phone });
  if (existing) return sendError(res, 409, "Phone number already registered");

  const hashed = await bcrypt.hash(password, 10);
  const customer = await Customer.create({ name, phone, email: email || null, password: hashed });

  const token = signToken(customer._id, customer.phone);
  return sendSuccess(res, {
    token,
    customer: { _id: customer._id, name: customer.name, phone: customer.phone, email: customer.email },
  }, "Registration successful", null, 201);
});

exports.login = asyncHandler(async (req, res) => {
  const { phone, email, password } = req.body;
  if (!password || (!phone && !email)) return sendError(res, 400, "Phone or email and password are required");

  const query = phone ? { phone } : { email };
  const customer = await Customer.findOne({ ...query, status: true });
  if (!customer) return sendError(res, 401, "Invalid credentials");

  const valid = await bcrypt.compare(password, customer.password);
  if (!valid) return sendError(res, 401, "Invalid credentials");

  const token = signToken(customer._id, customer.phone);
  return sendSuccess(res, {
    token,
    customer: { _id: customer._id, name: customer.name, phone: customer.phone, email: customer.email },
  }, "Login successful");
});

exports.getMe = asyncHandler(async (req, res) => {
  const customer = req.customer;
  return sendSuccess(res, {
    _id: customer._id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    isVerified: customer.isVerified,
  }, "Profile fetched");
});
