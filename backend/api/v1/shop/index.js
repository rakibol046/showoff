const router = require("express").Router();

const productRouter = require("./products/product.router");
const categoryRouter = require("./categories/category.router");
const sliderRouter = require("./sliders/slider.router");
const settingsRouter = require("./settings/settings.router");
const authRouter = require("./auth/auth.router");
const orderRouter = require("./orders/order.router");

router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/sliders", sliderRouter);
router.use("/settings", settingsRouter);
router.use("/auth", authRouter);
router.use("/orders", orderRouter);

module.exports = router;
