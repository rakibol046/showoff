const express = require("express");
const categoryController = require("../controllers/category.controller");

const router = express.Router();

router.get("/", categoryController.getCategories);
router.get("/parent", categoryController.getParentCategories);
router.get("/top", categoryController.getTopCategories);
router.get("/:id", categoryController.getCategory);
router.put('/update/:id"', categoryController.updateCategory);
router.delete('/delete/:id"', categoryController.deleteCategory);
router.post("/add", categoryController.createCategory);

module.exports = router;
