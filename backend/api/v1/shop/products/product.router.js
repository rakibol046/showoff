const router = require("express").Router();
const ctrl = require("./product.controller");

router.get("/", ctrl.getProducts);
router.get("/:slug", ctrl.getProductBySlug);

module.exports = router;
