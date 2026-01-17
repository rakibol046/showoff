const express = require('express');
const productController = require('../controllers/product.controller');


const router = express.Router();

router.get('/all',productController.getProducts);
router.delete('/delete/:id', productController.deleteProduct)

module.exports = router;