const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Admin Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("Admin"),
  getDashboardStats
);

module.exports = router;