const pool = require("../config/db");
const bcrypt = require("bcrypt");

const createUser = async (firstName, lastName, email, phoneNumber) => {
    const result = await pool.query(
        "INSERT INTO users (first_name, last_name, email, phone_number) VALUES ($1, $2, $3, $4) RETURNING *",
        [firstName, lastName, email, phoneNumber]
    );
    return result.rows[0];
};

const getUsers = async () => {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
};

const getUserById = async (id) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
};

const getUserByEmail = async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

const getUserProducts = async (userId) => {
    const result = await pool.query(
        "SELECT * FROM products WHERE user_id = $1",
        [userId]
    );
    return result.rows;
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    getUserByEmail,
    hashPassword,
    comparePassword,
    getUserProducts
};