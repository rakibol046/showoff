const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../../../models/admin.model");

exports.adminLogin = async (req, res) => {
  try {
    console.log("login called");
    console.log(req.body);
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      throw new Error("Invalid Admin Email.");
    }

    const isValidPass = await bcrypt.compare(password, admin.password);
    if (!isValidPass) {
      throw new Error("Invalid password, try again!");
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.status(200).json({
      message: "Sign-in successful",
      token,
      expiresIn: new Date(Date.now() + 24 * 2 * 60 * 60),
      error: false,
    });
  } catch (error) {
    res.status(400).json({
      status: "unsuccessful Sign-in, try again please.",
      message: error.message,
      error: true,
    });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const admin_id = req.adminData.id;

    let data = await Admin.findById(admin_id);

    if (!data) {
      throw new Error("Admin not found!");
    }
    res.status(200).json({
      message: "Admin profile",
      admin: data,
      error: false,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed to get profile data",
      message: error.message,
      error: true,
    });
  }
};
