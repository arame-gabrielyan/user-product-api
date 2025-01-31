const User = require('../models/user.model');
const Product = require('../models/product.model');

const getProducts = async (req, res, next) => {
        try {
            const products = await Product.find({}).populate('userId');;
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
}

const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('userId');
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const { name, quantity, price, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        const product = new Product({
            name,
            quantity,
            price,
            userId  
        });

        await product.save();
        res.status(201).json(product);  

    } catch (error) {
        next(error); 
    }
};


const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
};


const deleteProduct = async (req, res, next) => {
    try {
        const {id} = req.params;  
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            
            return res.status(404).json({message: "Product not found"});

        }

        res.status(200).json({message: "Product deleted successfully"});

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}