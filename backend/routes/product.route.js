const express = require("express");
const router = express.Router();
const validateProduct = require('../validation/product/validators.js');
const {getProducts, getProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/product.controller.js');


//read

router.get('/', getProducts);

router.get("/:id", getProduct);

//create
router.post("/", validateProduct, createProduct);

// update
router.patch("/:id",  validateProduct, updateProduct);

//delete
router.delete("/:id", deleteProduct);

module.exports = router;