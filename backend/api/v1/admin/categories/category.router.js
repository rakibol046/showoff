const router = require("express").Router();
const ctrl = require("./category.controller");
const upload = require("../../../../utils/upload");

router.get("/", ctrl.getCategories);
router.get("/parents", ctrl.getParentCategories);
router.get("/top", ctrl.getTopCategories);
router.get("/:id", ctrl.getCategory);
router.post("/", upload.single("logo"), ctrl.createCategory);
router.put("/:id", upload.single("logo"), ctrl.updateCategory);
router.delete("/:id", ctrl.deleteCategory);

module.exports = router;
