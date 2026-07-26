const express = require("express");
const router = express.Router();

const {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    deleteAppointment
} = require("../controllers/appointmentController");

const authMiddleware = require("../middlewares/authMiddleware");

// Create Appointment
router.post("/", authMiddleware, createAppointment);

// Get All Appointments
router.get("/", authMiddleware, getAppointments);

// Get Single Appointment
router.get("/:id", authMiddleware, getAppointmentById);

// Update Appointment Status
router.put("/:id", authMiddleware, updateAppointmentStatus);

// Delete Appointment
router.delete("/:id", authMiddleware, deleteAppointment);

module.exports = router;