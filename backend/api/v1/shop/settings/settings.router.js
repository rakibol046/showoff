const router = require("express").Router();
const ctrl = require("./settings.controller");

router.get("/", ctrl.getSettings);

module.exports = router;
