const router = require("express").Router();
const ctrl = require("./product.controller");
const upload = require("../../../../utils/upload");

router.get("/", ctrl.getProducts);
router.post("/", upload.array("images", 10), ctrl.createProduct);
router.get("/:id", ctrl.getProduct);
router.put("/:id", upload.array("images", 10), ctrl.updateProduct);
router.patch("/:id/status", ctrl.toggleProductStatus);
router.delete("/:id", ctrl.deleteProduct);

module.exports = router;
