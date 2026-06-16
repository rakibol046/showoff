const router = require("express").Router();
const ctrl = require("./settings.controller");

router.get("/", ctrl.getSettings);
router.put("/", ctrl.updateSettings);

module.exports = router;
