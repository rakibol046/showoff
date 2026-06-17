const Settings = require("../../../../models/settings.model");
const asyncHandler = require("../../../../middlewares/asyncHandler");
const { sendSuccess } = require("../../../../utils/apiResponse");

exports.getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.findOne().lean();
  return sendSuccess(res, {
    storeName: settings?.storeName || process.env.STORE_NAME || "Showoff",
    currency: settings?.currency || process.env.Currency || "USD",
    currencySymbol: settings?.currencySymbol || process.env.CurrencySymbol || "$",
  }, "Settings fetched");
});
