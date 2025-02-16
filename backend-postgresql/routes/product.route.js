const express = require("express");
const router = express.Router();
const validateProduct = require('../validation/product/validators.js');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller.js');

router.get('/', getProducts);

router.get("/:id", getProduct);

router.post("/", validateProduct, createProduct);

router.patch("/:id", validateProduct, updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;