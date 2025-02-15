require("dotenv").config();
const cors = require('cors');
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const adminRoute = require("./modules/admin/api");
const clientRoute = require("./modules/client/api");
const Product = require("./models/product.model");
const Admin = require("./models/admin.model");
const { products } = require("./demo_data");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async function () {
  try {
    await mongoose
      .connect(
        process.env.MONGODB_URI ||
        "mongodb://localhost:27017/showoff-db"
      )
      .then(async () => {
        console.log("✅ MongoDB connected successfully");
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
        const adminData = {
          email: process.env.ADMIN_EMAIL,
          password: hashedPassword,
          name: process.env.ADMIN_NAME,
        }
        const existingAdmin = await Admin.find();
        if (existingAdmin.length === 0) {
          await new Admin(adminData).save();
          console.log("✅ Admin created successfully!");
        } 

        const existingProducts = await Product.find();
        if (existingProducts.length === 0) {
          await Product.insertMany(products);
          console.log("✅ Default products inserted successfully!");
        } 
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
      });

    app.use("/admin_api", adminRoute);
    app.use("/api", clientRoute);

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running`);
    });
  } catch (error) {
    console.log(error.message);
  }
})();
