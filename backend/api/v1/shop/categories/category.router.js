const router = require("express").Router();
const ctrl = require("./category.controller");

router.get("/", ctrl.getCategoriesTree);
router.get("/top", ctrl.getTopCategories);
router.get("/parents", ctrl.getParentCategories);

module.exports = router;
