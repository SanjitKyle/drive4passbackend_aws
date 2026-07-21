const FranchiseEnquiry = require('../../models/DS/franchise_enquiry.model');

exports.createFranchiseEnquiry = async (req, res) => {
    try {
        const { first_name, email, phone, instructor_type, franchise_status, postcode, message, status } = req.body;
        
        const formData = {
            first_name, email, phone, instructor_type, franchise_status, postcode, message, status
        };

        // Remove undefined or empty string fields to avoid enum validation errors
        Object.keys(formData).forEach(key => {
            if (formData[key] === undefined || formData[key] === '') {
                delete formData[key];
            }
        });

        const newForm = new FranchiseEnquiry(formData);

        await newForm.save();

        res.status(200).json({
            status: true,
            message: 'Franchise enquiry submitted successfully',
            data: newForm
        });
    } catch (error) {
        console.error('Error in createFranchiseEnquiry:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.getAllFranchiseEnquiries = async (req, res) => {
    try {
        const enquiries = await FranchiseEnquiry.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            data: enquiries
        });
    } catch (error) {
        console.error('Error in getAllFranchiseEnquiries:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.getFranchiseEnquiryById = async (req, res) => {
    try {
        const { id } = req.params;
        const enquiry = await FranchiseEnquiry.findById(id);
        if (!enquiry) {
            return res.status(404).json({ status: false, message: 'Franchise enquiry not found' });
        }
        res.status(200).json({ status: true, data: enquiry });
    } catch (error) {
        console.error('Error in getFranchiseEnquiryById:', error);
        res.status(500).json({ status: false, message: 'Internal Server Error', error: error.message });
    }
};

exports.updateFranchiseEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, email, phone, instructor_type, franchise_status, postcode, message, status } = req.body;
        
        const formData = {
            first_name, email, phone, instructor_type, franchise_status, postcode, message, status
        };

        Object.keys(formData).forEach(key => {
            if (formData[key] === undefined || formData[key] === '') {
                delete formData[key];
            }
        });

        const updatedEnquiry = await FranchiseEnquiry.findByIdAndUpdate(id, formData, { new: true });

        if (!updatedEnquiry) {
            return res.status(404).json({ status: false, message: 'Franchise enquiry not found' });
        }

        res.status(200).json({
            status: true,
            message: 'Franchise enquiry updated successfully',
            data: updatedEnquiry
        });
    } catch (error) {
        console.error('Error in updateFranchiseEnquiry:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.deleteFranchiseEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEnquiry = await FranchiseEnquiry.findByIdAndDelete(id);

        if (!deletedEnquiry) {
            return res.status(404).json({ status: false, message: 'Franchise enquiry not found' });
        }
 
        res.status(200).json({
            status: true,
            message: 'Franchise enquiry deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteFranchiseEnquiry:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.updateFranchiseEnquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                status: false,
                message: 'Status is required'
            });
        }

        const updatedEnquiry = await FranchiseEnquiry.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedEnquiry) {
            return res.status(404).json({ status: false, message: 'Franchise enquiry not found' });
        }

        res.status(200).json({
            status: true,
            message: 'Franchise enquiry status updated successfully',
            data: updatedEnquiry
        });
    } catch (error) {
        console.error('Error in updateFranchiseEnquiryStatus:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
