const router = require("express").Router();
const ctrl = require("./category.controller");

router.get("/", ctrl.getCategories);
router.get("/top", ctrl.getTopCategories);
router.get("/parents", ctrl.getParentCategories);

module.exports = router;
