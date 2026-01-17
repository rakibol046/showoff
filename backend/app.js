require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const adminRoute = require("./services/admin-api/api");
const clientRoute = require("./services/public-api/api");
const Product = require("./models/product.model");
const Admin = require("./models/admin.model");
const { defaultProducts, defaultSlider } = require("./demo_data");
const Slider = require("./models/slider.model");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

(async function () {
  try {
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(async () => {
        console.log("✅ MongoDB connected successfully");
        const hashedPassword = await bcrypt.hash(
          process.env.ADMIN_PASSWORD,
          10,
        );
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

        const existingProducts = await Product.find();
        if (existingProducts.length === 0) {
          await Product.insertMany(defaultProducts);
          console.log("✅ Default products inserted successfully!");
        }
        const existingSlider = await Slider.find();
        if (existingSlider.length === 0) {
          await Slider.insertMany(defaultSlider);
          console.log("✅ Default Sliders inserted successfully!");
        }
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
