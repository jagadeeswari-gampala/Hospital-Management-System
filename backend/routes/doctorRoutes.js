const express = require("express");
const router = express.Router();

const {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
} = require("../controllers/doctorController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Create doctor
router.post("/", authMiddleware, roleMiddleware("Admin"), createDoctor);

// Get all doctors
router.get("/", authMiddleware, getDoctors);


// Get single doctor
router.get("/:id", authMiddleware, getDoctorById);


// Update doctor
router.put("/:id", authMiddleware, roleMiddleware("Admin"), updateDoctor);

// Delete doctor
router.delete("/:id", authMiddleware, roleMiddleware("Admin"), deleteDoctor);

module.exports = router;