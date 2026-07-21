const SchoolModel = require('../models/school.model');

// Create a new school
exports.createSchool = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Check if school with the same email already exists
        const existingSchool = await SchoolModel.findOne({ email });
        if (existingSchool) {
            return res.status(400).json({
                status: false,
                message: 'School with this email already exists'
            });
        }

        // Create a new school instance with request body and user ID
        const school = new SchoolModel({
            ...req.body,
            created_by: req.user._id, // Automatically set the creator
            last_updated_by: req.user._id // Also set the last updater
        });
        
        await school.save();
        
        return res.status(201).json({
            status: true,
            message: 'School created successfully',
            data: school
        });
    } catch (err) {
        next(err);
    }
};

// Get all schools
exports.getSchools = async (req, res, next) => {
    try {
        const schools = await SchoolModel.find();
        return res.status(200).json({
            status: true,
            message: 'Schools fetched successfully',
            data: schools
        });
    } catch (err) {
        next(err);
    }
};

// Get a single school by ID
exports.getSchoolById = async (req, res, next) => {
    try {
        const school = await SchoolModel.findById(req.params.id);
        if (!school) {
            return res.status(404).json({
                status: false,
                message: 'School not found'
            });
        }
        return res.status(200).json({
            status: true,
            message: 'School fetched successfully',
            data: school
        });
    } catch (err) {
        next(err);
    }
};

// Update a school by ID
exports.updateSchool = async (req, res, next) => {
    try {
        const updateData = {
            ...req.body,
            last_updated_by: req.user._id // Automatically set the updater
        };

        const school = await SchoolModel.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        
        if (!school) {
            return res.status(404).json({
                status: false,
                message: 'School not found'
            });
        }
        
        return res.status(200).json({
            status: true,
            message: 'School updated successfully',
            data: school
        });
    } catch (err) {
        next(err);
    }
};

// Delete a school by ID
exports.deleteSchool = async (req, res, next) => {
    try {
        const school = await SchoolModel.findByIdAndDelete(req.params.id);
        if (!school) {
            return res.status(404).json({
                status: false,
                message: 'School not found'
            });
        }
        return res.status(200).json({
            status: true,
            message: 'School deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
