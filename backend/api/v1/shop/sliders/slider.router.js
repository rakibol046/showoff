const router = require("express").Router();
const ctrl = require("./slider.controller");

router.get("/", ctrl.getSliders);

module.exports = router;
