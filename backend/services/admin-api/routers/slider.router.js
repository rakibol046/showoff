const express = require("express");
const sliderController = require("../controllers/slider.controller");

const router = express.Router();

router.get("/", sliderController.getSliders);
// router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
