const pool = require("../config/db");

const createProduct = async (name, quantity, price, userId) => {
    const result = await pool.query(
        "INSERT INTO products (name, quantity, price, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, quantity, price, userId]
    );
    return result.rows[0];
};

const getProducts = async () => {
    const result = await pool.query("SELECT * FROM products");
    return result.rows;
};

const getProductById = async (id) => {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    return result.rows[0];
};

const updateProduct = async (id, name, quantity, price) => {
    const result = await pool.query(
        "UPDATE products SET name = $1, quantity = $2, price = $3 WHERE id = $4 RETURNING *",
        [name, quantity, price, id]
    );
    return result.rows[0];
};

const deleteProduct = async (id) => {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };