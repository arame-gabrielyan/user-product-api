const express = require("express");

const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '.env')
});

const pool = require("./config/db.js"); // Import pool from db.js
const productRoute = require('./routes/product.route.js');
const userRoute = require('./routes/user.route.js');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRoute);

app.use("/api/products", productRoute);

app.get('/', (req, res) => {
    res.send("Hello from Node API");
});

app.get('/api', (req, res) => {
    res.send('API route works');
});

pool.connect()
    .then(() => {
        console.log("Connected to PostgreSQL database!");
        app.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
