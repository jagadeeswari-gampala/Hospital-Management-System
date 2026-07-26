const express = require("express");
const router = express.Router();

const {
  getUsers,
  registerUser,
  loginUser,
} = require("../controllers/userController");

// Get all users
router.get("/", getUsers);

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

module.exports = router;