const express = require("express");
const router = express.Router();
const validateUser = require('../validation/users/user_validation.js');
const {getUsers, getUser, createUser, updateUser, deleteUser} = require('../controllers/user.controller.js');


//read

router.get('/', getUsers);

router.get("/:id", getUser);

//create
router.post("/", validateUser, createUser);

// update
router.patch("/:id",  validateUser, updateUser);

//delete
router.delete("/:id", deleteUser);

module.exports = router;