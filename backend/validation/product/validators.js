const { body, validationResult } = require('express-validator');

const validateProduct = [
    body('name')
        .isString().withMessage('Name must be a string')
        .notEmpty().withMessage('Name is required'),
    body('quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
        .notEmpty().withMessage('Quantity is required'),
    body('price')
        .isFloat().withMessage('Price must be a positive number')
        .notEmpty().withMessage('Price is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.errors.map(i=>i.msg) }); // Sends errors if validation fails
        }
        next();
    }
];

module.exports = validateProduct;
