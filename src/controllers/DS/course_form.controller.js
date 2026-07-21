const CourseForm = require('../../models/DS/course_form.model');

exports.createCourseForm = async (req, res) => {
    try {
        const { name, email, phone, course_interested, previous_lessons, transmission, postcode, additional_message } = req.body;
        
        const formData = {
            name, email, phone, course_interested, previous_lessons, transmission, postcode, additional_message
        };

        // Remove undefined or empty string fields to avoid enum validation errors
        Object.keys(formData).forEach(key => {
            if (formData[key] === undefined || formData[key] === '') {
                delete formData[key];
            }
        });

        const newForm = new CourseForm(formData);

        await newForm.save();

        res.status(200).json({
            status: true,
            message: 'Course form submitted successfully',
            data: newForm
        });
    } catch (error) {
        console.error('Error in createCourseForm:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.getAllCourseForms = async (req, res) => {
    try {
        const forms = await CourseForm.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            data: forms
        });
    } catch (error) {
        console.error('Error in getAllCourseForms:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.getCourseFormById = async (req, res) => {
    try {
        const { id } = req.params;
        const form = await CourseForm.findById(id);
        if (!form) {
            return res.status(404).json({ status: false, message: 'Course form not found' });
        }
        res.status(200).json({ status: true, data: form });
    } catch (error) {
        console.error('Error in getCourseFormById:', error);
        res.status(500).json({ status: false, message: 'Internal Server Error', error: error.message });
    }
};

exports.updateCourseForm = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, course_interested, previous_lessons, transmission, postcode, additional_message } = req.body;
        
        const formData = {
            name, email, phone, course_interested, previous_lessons, transmission, postcode, additional_message
        };

        Object.keys(formData).forEach(key => {
            if (formData[key] === undefined || formData[key] === '') {
                delete formData[key];
            }
        });

        const updatedForm = await CourseForm.findByIdAndUpdate(id, formData, { new: true });

        if (!updatedForm) {
            return res.status(404).json({ status: false, message: 'Course form not found' });
        }

        res.status(200).json({
            status: true,
            message: 'Course form updated successfully',
            data: updatedForm
        });
    } catch (error) {
        console.error('Error in updateCourseForm:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.deleteCourseForm = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedForm = await CourseForm.findByIdAndDelete(id);

        if (!deletedForm) {
            return res.status(404).json({ status: false, message: 'Course form not found' });
        }

        res.status(200).json({
            status: true,
            message: 'Course form deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteCourseForm:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
