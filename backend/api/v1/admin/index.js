const router = require("express").Router();
const adminAuth = require("../../../middlewares/auth.middleware");

const authRouter = require("./auth/auth.router");
const categoryRouter = require("./categories/category.router");
const productRouter = require("./products/product.router");
const colorRouter = require("./colors/color.router");
const sizeRouter = require("./sizes/size.router");
const sliderRouter = require("./sliders/slider.router");
const orderRouter = require("./orders/order.router");
const customerRouter = require("./customers/customer.router");
const dashboardRouter = require("./dashboard/dashboard.router");
const settingsRouter = require("./settings/settings.router");

// Public admin route (no auth)
router.use("/auth", authRouter);

// All routes below require admin auth
router.use(adminAuth);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/colors", colorRouter);
router.use("/sizes", sizeRouter);
router.use("/sliders", sliderRouter);
router.use("/orders", orderRouter);
router.use("/customers", customerRouter);
router.use("/dashboard", dashboardRouter);
router.use("/settings", settingsRouter);

module.exports = router;
