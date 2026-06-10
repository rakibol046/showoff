const express = require("express");
const categoryController = require("../controllers/category.controller");

const router = express.Router();

router.get("/", categoryController.getCategories);
router.get("/parent", categoryController.getParentCategories);
router.get("/top", categoryController.getTopCategories);
router.get("/:id", categoryController.getCategory);

module.exports = router;
