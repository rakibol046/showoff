const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../../../models/admin.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess, sendError } = require("../../../../utils/apiResponse");

exports.signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return sendError(res, 400, "Email and password are required");

  const admin = await Admin.findOne({ email });
  if (!admin) return sendError(res, 401, "Invalid credentials");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return sendError(res, 401, "Invalid credentials");

  const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  return sendSuccess(res, {
    accessToken: token,
    admin: { _id: admin._id, email: admin.email, name: admin.name, profile_picture: admin.profile_picture },
    expiresIn: "2d",
  }, "Login successful");
});

exports.getProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select("-password");
  return sendSuccess(res, admin, "Profile fetched");
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const update = {};
  if (name) update.name = name;
  if (phone) update.phone = phone;
  if (req.file) update.profile_picture = `/uploads/${req.file.filename}`;

  const admin = await Admin.findByIdAndUpdate(req.admin._id, update, { new: true, runValidators: true }).select("-password");
  return sendSuccess(res, admin, "Profile updated");
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return sendError(res, 400, "Both passwords are required");
  if (newPassword.length < 6) return sendError(res, 400, "New password must be at least 6 characters");

  const admin = await Admin.findById(req.admin._id);
  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) return sendError(res, 401, "Current password is incorrect");

  admin.password = await bcrypt.hash(newPassword, 10);
  await admin.save();
  return sendSuccess(res, null, "Password changed successfully");
});
