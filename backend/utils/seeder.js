const bcrypt = require("bcryptjs");
const logger = require("../config/logger");

const Admin    = require("../models/admin.model");
const Slider   = require("../models/slider.model");
const Color    = require("../models/color.model");
const Size     = require("../models/size.model");
const Category = require("../models/category.model");
const Product  = require("../models/product.model");
const Settings = require("../models/settings.model");

const {
  defaultProducts,
  defaultSlider,
  defaultColors,
  defaultCategories,
  defaultSizes,
} = require("../demo_data");

const seed = async (collection, data, label) => {
  const count = await collection.countDocuments();
  if (count === 0) {
    await collection.insertMany(data);
    logger.info(`Seeded ${label}`);
  }
};

const seedAdmin = async () => {
  const count = await Admin.countDocuments();
  if (count === 0) {
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password,
      name: process.env.ADMIN_NAME || "Admin",
    });
    logger.info("Seeded default admin account");
  }
};

const seedSettings = async () => {
  const count = await Settings.countDocuments();
  if (count === 0) {
    await Settings.create({
      storeName: process.env.STORE_NAME || "Showoff",
      storeEmail: process.env.STORE_EMAIL || "",
      storeAddress: process.env.STORE_ADDRESS || "",
      currency: process.env.Currency || "USD",
      currencySymbol: process.env.CurrencySymbol || "$",
    });
    logger.info("Seeded settings");
  }
};

const runSeeder = async () => {
  try {
    await seedAdmin();
    await seedSettings();
    await seed(Slider,   defaultSlider,     "sliders");
    await seed(Color,    defaultColors,     "colors");
    await seed(Size,     defaultSizes,      "sizes");
    await seed(Category, defaultCategories, "categories");
    await seed(Product,  defaultProducts,   "products");
  } catch (err) {
    logger.error(`Seeder failed: ${err.message}`);
  }
};

module.exports = { runSeeder };
