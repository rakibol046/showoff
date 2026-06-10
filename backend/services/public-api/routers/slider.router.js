const express = require("express");
const sliderController = require("../controllers/slider.controller");

const router = express.Router();

router.get("/", sliderController.getSliders);

module.exports = router;
