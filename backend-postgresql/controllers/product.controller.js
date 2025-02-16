const pool = require('../config/db');

const getProducts = async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT products.*, users.first_name, users.last_name
            FROM products
            JOIN users ON products.user_id = users.id
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};

const getProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    const { name, quantity, price, userId } = req.body;

    const userCheckResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userCheckResult.rows.length === 0) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    try {
        const result = await pool.query(
            'INSERT INTO products (name, quantity, price, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, quantity, price, userId]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { name, quantity, price } = req.body;
    
    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, quantity = $2, price = $3 WHERE id = $4 RETURNING *',
            [name, quantity, price, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};
