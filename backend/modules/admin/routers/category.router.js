const express = require("express");
const categoryController = require("../controllers/category.controller");

const router = express.Router();

router.get("/all", categoryController.getCategories);
router.get("/parent/all", categoryController.getParentCategories);
router.get("/:id", categoryController.getCategory);
router.put('/update/:id"', categoryController.updateCategory);
router.delete('/delete/:id"', categoryController.deleteCategory);
router.post("/add", categoryController.createCategory);

module.exports = router;
