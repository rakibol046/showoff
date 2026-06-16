const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  storeName: { type: String, default: "Showoff" },
  storeEmail: { type: String, default: "" },
  storeAddress: { type: String, default: "" },
  currency: { type: String, default: "USD" },
  currencySymbol: { type: String, default: "$" },
});

module.exports = mongoose.model("Settings", settingsSchema);
