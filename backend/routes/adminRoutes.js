const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../controllers/appointmentController");

const authMiddleware = require("../middlewares/authMiddleware");

// Create Appointment
router.post("/", authMiddleware, createAppointment);

// Get All Appointments
router.get("/", authMiddleware, getAllAppointments);

// Get Logged-in Patient Appointments
// Keep this route before "/:id"
router.get("/my-appointments", authMiddleware, getMyAppointments);

// Get Appointment by ID
router.get("/:id", authMiddleware, getAppointmentById);

// Update Appointment
router.put("/:id", authMiddleware, updateAppointment);

// Update Appointment Status
router.patch("/:id/status", authMiddleware, updateAppointmentStatus);

// Delete Appointment
router.delete("/:id", authMiddleware, deleteAppointment);

module.exports = router;