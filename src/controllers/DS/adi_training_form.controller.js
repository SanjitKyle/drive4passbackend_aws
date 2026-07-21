const AdiTrainingForm = require('../../models/DS/adi_training_form.model');

exports.createAdiTrainingForm = async (req, res) => {
    try {
        const { name, email, phone, training_status, franchise_status, postcode, message } = req.body;
        
        const formData = {
            name, email, phone, training_status, franchise_status, postcode, message
        };

        // Remove undefined or empty string fields to avoid enum validation errors
        Object.keys(formData).forEach(key => {
            if (formData[key] === undefined || formData[key] === '') {
                delete formData[key];
            }
        });

        const newForm = new AdiTrainingForm(formData);

        await newForm.save();

        res.status(200).json({
            status: true,
            message: 'ADI Training form submitted successfully',
            data: newForm
        });
    } catch (error) {
        console.error('Error in createAdiTrainingForm:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.getAllAdiTrainingForms = async (req, res) => {
    try {
        const forms = await AdiTrainingForm.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            data: forms
        });
    } catch (error) {
        console.error('Error in getAllAdiTrainingForms:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.getAdiTrainingFormById = async (req, res) => {
    try {
        const { id } = req.params;
        const form = await AdiTrainingForm.findById(id);
        if (!form) {
            return res.status(404).json({ status: false, message: 'ADI Training form not found' });
        }
        res.status(200).json({ status: true, data: form });
    } catch (error) {
        console.error('Error in getAdiTrainingFormById:', error);
        res.status(500).json({ status: false, message: 'Internal Server Error', error: error.message });
    }
};

exports.updateAdiTrainingForm = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, training_status, franchise_status, postcode, message } = req.body;
        
        const formData = {
            name, email, phone, training_status, franchise_status, postcode, message
        };

        Object.keys(formData).forEach(key => {
            if (formData[key] === undefined || formData[key] === '') {
                delete formData[key];
            }
        });

        const updatedForm = await AdiTrainingForm.findByIdAndUpdate(id, formData, { new: true });

        if (!updatedForm) {
            return res.status(404).json({ status: false, message: 'ADI Training form not found' });
        }

        res.status(200).json({
            status: true,
            message: 'ADI Training form updated successfully',
            data: updatedForm
        });
    } catch (error) {
        console.error('Error in updateAdiTrainingForm:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.deleteAdiTrainingForm = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedForm = await AdiTrainingForm.findByIdAndDelete(id);

        if (!deletedForm) {
            return res.status(404).json({ status: false, message: 'ADI Training form not found' });
        }

        res.status(200).json({
            status: true,
            message: 'ADI Training form deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteAdiTrainingForm:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
