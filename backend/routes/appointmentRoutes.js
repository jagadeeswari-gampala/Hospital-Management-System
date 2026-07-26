const express = require("express");
const router = express.Router();

const {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointmentStatus
} = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware");


// Create appointment
router.post("/", authMiddleware, createAppointment);


// Get all appointments
router.get("/", authMiddleware, getAppointments);


// Get single appointment by ID
router.get("/:id", authMiddleware, getAppointmentById);
// Update appointment status
router.put("/:id", authMiddleware, updateAppointmentStatus);

module.exports = router;