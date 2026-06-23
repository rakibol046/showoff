const Settings = require("../../../../models/settings.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess, sendError } = require("../../../../utils/apiResponse");

const ALLOWED_FIELDS = ["storeName", "storeEmail", "storeAddress", "currency", "currencySymbol"];

exports.getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne().lean();

  if (!settings) {
    settings = {
      storeName: process.env.STORE_NAME || "Showoff",
      storeEmail: process.env.STORE_EMAIL || "",
      storeAddress: process.env.STORE_ADDRESS || "",
      currency: process.env.Currency || "USD",
      currencySymbol: process.env.CurrencySymbol || "$",
    };
  }

  return sendSuccess(res, settings, "Settings fetched");
});

exports.updateSettings = asyncHandler(async (req, res) => {
  const update = {};
  for (const key of ALLOWED_FIELDS) {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  }

  if (!Object.keys(update).length) return sendError(res, 400, "No valid fields provided");

  const settings = await Settings.findOneAndUpdate({}, update, {
    upsert: true,
    new: true,
    runValidators: true,
  }).lean();

  return sendSuccess(res, settings, "Settings updated");
});
