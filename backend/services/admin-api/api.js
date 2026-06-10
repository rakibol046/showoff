const express = require("express");
const categoryRouter = require("./routers/category.router");
const productsRouter = require("./routers/product.router");
const authRouter = require("./routers/auth.router");
const sliderRouter = require("./routers/slider.router");
const SizeRouter = require("./routers/size.router");
const ColorRouter = require("./routers/color.router");

const router = express.Router();

router.use("/category", categoryRouter);
router.use("/product", productsRouter);
router.use("/auth", authRouter);
router.use("/slider", sliderRouter);
router.use("/sizes", SizeRouter);
router.use("/colors", ColorRouter);

module.exports = router;
