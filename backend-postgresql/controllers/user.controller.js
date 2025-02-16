const pool = require('../config/db'); 

const getUsers = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const productResult = await pool.query('SELECT * FROM products WHERE user_id = $1', [id]);

        const user = userResult.rows[0];
        user.products = productResult.rows; 

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    const { first_name, last_name, email, phone_number, products } = req.body;
    try {
        const userResult = await pool.query(
            'INSERT INTO users (first_name, last_name, email, phone_number) VALUES ($1, $2, $3, $4) RETURNING *',
            [first_name, last_name, email, phone_number]
        );

        const user = userResult.rows[0];

        if (products && products.length > 0) {
            const productPromises = products.map(productData => {
                return pool.query(
                    'INSERT INTO products (name, quantity, price, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
                    [productData.name, productData.quantity, productData.price, user.id]
                );
            });
            await Promise.all(productPromises); 
        }

        const userWithProducts = await getUser({ params: { id: user.id }}, res, next);
        res.status(201).json(userWithProducts);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const userResult = await pool.query(
            'UPDATE users SET first_name = $1, last_name = $2, email = $3, phone_number = $4 WHERE id = $5 RETURNING *',
            [req.body.first_name, req.body.last_name, req.body.email, req.body.phone_number, id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(userResult.rows[0]);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const userResult = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        await pool.query('DELETE FROM products WHERE user_id = $1', [id]);

        res.status(200).json({ message: 'User and their products deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};
