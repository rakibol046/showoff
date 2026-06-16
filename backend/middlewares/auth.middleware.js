const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const asyncHandler = require("./asyncHandler");

const adminAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const admin = await Admin.findOne({ _id: decoded.id, email: decoded.email }).select("-password");
  if (!admin) {
    return res.status(401).json({ success: false, message: "Admin not found" });
  }

  req.admin = admin;
  next();
});

module.exports = adminAuth;
