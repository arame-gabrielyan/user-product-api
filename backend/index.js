const express = require('express');
const mongoose = require('mongoose');
const productRoute = require('./routes/product.route.js');
const userRoute = require('./routes/user.route.js');
const app = express();


//middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//routes
app.use("/api/users", userRoute);

app.use("/api/products", productRoute);

app.get('/', (req,res) => {
    res.send("Hello from Node API");
});


mongoose.connect("mongodb+srv://user:user@api.0pmga.mongodb.net/Node-API?retryWrites=true&w=majority&appName=API")
.then(() => {
    console.log("Connected to database!");
    app.listen(5000, () => {
        console.log('Server is running on port 5000')
    });
})
.catch(() => {
    console.log("connection failed!");
})