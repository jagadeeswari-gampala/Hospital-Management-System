const Appointment = require("../models/Appointment");


// Create Appointment
exports.createAppointment = async (req, res) => {
    try {

        const appointment = await Appointment.create(req.body);

        res.status(201).json({
            success: true,
            message: "Appointment created successfully",
            appointment
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Get All Appointments
exports.getAppointments = async (req, res) => {
    try {

        const appointments = await Appointment.find()
            .populate("patient")
            .populate("doctor");

        res.status(200).json({
            success: true,
            totalAppointments: appointments.length,
            appointments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Get Single Appointment
exports.getAppointmentById = async (req, res) => {
    try {

        const appointment = await Appointment.findById(req.params.id)
            .populate("patient")
            .populate("doctor");


        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }


        res.status(200).json({
            success: true,
            appointment
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Update Appointment Status
exports.updateAppointmentStatus = async (req, res) => {
    try {

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            {
                new: true
            }
        );


        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Appointment status updated successfully",
            appointment
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};