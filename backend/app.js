require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const adminRoute = require("./services/admin-api/api");
const clientRoute = require("./services/public-api/api");
const Product = require("./models/product.model");
const Admin = require("./models/admin.model");
const {
  defaultProducts,
  defaultSlider,
  defaultColors,
  defaultCategories,
  defaultSizes,
} = require("./demo_data");
const Slider = require("./models/slider.model");
const Color = require("./models/color.model");
const Category = require("./models/category.model");
const size = require("./models/size.model");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const setDefaultData = async () => {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const adminData = {
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    name: process.env.ADMIN_NAME,
  };
  const existingAdmin = await Admin.find();
  if (existingAdmin.length === 0) {
    await new Admin(adminData).save();
    console.log("✅ Admin created successfully!");
  }

  const existingSlider = await Slider.find();
  if (existingSlider.length === 0) {
    await Slider.insertMany(defaultSlider);
    console.log("✅ Default Sliders inserted successfully!");
  }
  const existingColors = await Color.find();
  if (existingColors.length === 0) {
    await Color.insertMany(defaultColors);
    console.log("✅ Default Colors inserted successfully!");
  }

  const existingSizes = await size.find();
  if (existingSizes.length === 0) {
    await size.insertMany(defaultSizes);
    console.log("✅ Default Sizes inserted successfully!");
  }

  const existingCategories = await Category.find();
  if (existingCategories.length === 0) {
    await Category.insertMany(defaultCategories);
    console.log("✅ Default Categories inserted successfully!");
  }

  const existingProducts = await Product.find();
  if (existingProducts.length === 0) {
    await Product.insertMany(defaultProducts);
    console.log("✅ Default products inserted successfully!");
  }
};

(async function () {
  try {
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(async () => {
        console.log("✅ MongoDB connected successfully");
        await setDefaultData();
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
      });

    app.use("/admin-api", adminRoute);
    app.use("/api", clientRoute);

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running`);
    });
  } catch (error) {
    console.log(error.message);
  }
})();
