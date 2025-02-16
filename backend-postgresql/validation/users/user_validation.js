const { body, validationResult } = require('express-validator');
const pool = require('../../config/db'); 

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
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [value]);
            if (result.rows.length > 0) {
                throw new Error('Email already in use');
            }
            return true;
        }),
    body('phone_number')
        .isInt().withMessage('Phone number must be integer')
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
