const express = require('express');
const categoryRouter = require('./routers/category.router');
const productsRouter = require('./routers/product.router');
const authRouter = require('./routers/auth.router');
const sliderRouter = require('./routers/slider.router');

const router = express.Router();

router.use('/categories', categoryRouter);
router.use("/products", productsRouter);
router.use("/auth", authRouter);
router.use("/slider", sliderRouter);

module.exports = router;