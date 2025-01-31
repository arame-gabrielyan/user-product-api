const User = require('../models/user.model.js');
const Product = require('../models/product.model.js');

const getUsers = async (req, res, next) => {
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
}

const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('products');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const { first_name, last_name, email, phone_number, products } = req.body;
        const user = await User.create({ first_name, last_name, email, phone_number });

        if (products && products.length > 0) {
            const productPromises = products.map(productData => {
                const product = new Product({
                    ...productData,
                    userId: user._id  
                });
                return product.save();
            });
            await Promise.all(productPromises); 
        }

        const userWithProducts = await User.findById(user._id).populate('products');
        res.status(201).json(userWithProducts); 
    } catch (error) {
        next(error);  
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error); 
    }
};


const deleteUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        await Product.deleteMany({ userId: id });
        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}