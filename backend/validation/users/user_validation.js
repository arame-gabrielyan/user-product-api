const { body, validationResult } = require('express-validator');
const User = require('../../models/user.model');

const validateUser = [
    body('first_name')
        .isString().withMessage('First name must be a string')
        .notEmpty().withMessage('First name is required'),
    body('last_name')
        .isString().withMessage('Last name must be a string')
        .notEmpty().withMessage('Last name is required'),
    body('email')
        .isString().withMessage('Email must be a string')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .custom(async (value) => {
            const exists = await User.exists({email: value});
            if (exists) {
                throw new Error('Email already in use');
            }
            return true;
        }),
    body('phone_number')
        .isString().withMessage('Phone number must be string')
        .notEmpty().withMessage('Phone number is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.errors.map(i=>i.msg) }); 
        }
        next();
    }
];

module.exports = validateUser;
