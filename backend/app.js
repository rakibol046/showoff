require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World and hello rakib!");
});

app.listen(process.env.PORT, async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/showoff-db');
  console.log(`---App is Running---`);
});
