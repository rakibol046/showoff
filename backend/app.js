require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const adminRoute = require("./modules/admin/api");
const clientRoute = require("./modules/client/api");

const app = express();

(async function () {
  try {
    await mongoose
      .connect(
        // process.env.MONGODB_URI ||
       "mongodb://localhost:27017/showoff-db"
      )
      .then(() => console.log("---Database connected---"));

    app.use("/admin_api", adminRoute);
    app.use("/api", clientRoute);

    app.listen(process.env.PORT, () => {
      console.log(`---App is Running---`);
    });
  } catch (error) {
    console.log(error.message);
  }
})();
