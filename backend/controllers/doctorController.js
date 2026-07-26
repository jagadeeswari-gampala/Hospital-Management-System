const Doctor = require("../models/Doctor");


// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Admin
exports.createDoctor = async (req, res) => {
    try {

        const doctor = await Doctor.create(req.body);

        res.status(201).json({
            success: true,
            message: "Doctor created successfully",
            doctor
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Admin
exports.getDoctors = async (req, res) => {
    try {

        const doctors = await Doctor.find();

        res.status(200).json({
            success: true,
            totalDoctors: doctors.length,
            doctors
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Admin
exports.getDoctorById = async (req, res) => {
    try {

        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }


        res.status(200).json({
            success: true,
            doctor
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Admin
exports.updateDoctor = async (req, res) => {
    try {

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );


        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Doctor updated successfully",
            doctor
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Admin
exports.deleteDoctor = async (req, res) => {
    try {

        const doctor = await Doctor.findByIdAndDelete(req.params.id);


        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Doctor deleted successfully"
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};