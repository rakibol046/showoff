const express = require("express");
const categoryRouter = require("./routers/category.router");
const productsRouter = require("./routers/product.router");
const authRouter = require("./routers/auth.router");

const router = express.Router();

router.use("/category", categoryRouter);
router.use("/product", productsRouter);
router.use("/auth", authRouter);

module.exports = router;
