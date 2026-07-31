const Doctor = require("../models/doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();

    const totalPatients = await User.countDocuments({
      role: "Patient",
    });

    const totalAppointments = await Appointment.countDocuments();

    const availableDoctors = await Doctor.countDocuments({
      available: true,
    });

    res.status(200).json({
      success: true,
      data: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        availableDoctors,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};