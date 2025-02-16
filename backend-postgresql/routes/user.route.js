const express = require("express");
const router = express.Router();
const validateUser = require('../validation/users/user_validation.js');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/user.controller.js');

router.get('/', getUsers);
router.get("/:id", getUser);

router.post("/", validateUser, createUser);

router.patch("/:id", validateUser, updateUser);

router.delete("/:id", deleteUser);

module.exports = router;