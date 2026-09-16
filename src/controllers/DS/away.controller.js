const Away = require('../../models/DS/away.model');
const InstructorMaster = require('../../models/DS/instructor_master.model');

// Create Away
exports.createAway = async (req, res, next) => {
    try {
        const created_by = req.user._id;

        const { instructor_id, date, start_time, end_time, reason, status, color } = req.body;

        if (!instructor_id || !start_time || !end_time) {
            return res.status(400).json({
                status: false,
                message: 'instructor_id, start_time, and end_time are required.'
            });
        }

        const instructor = await InstructorMaster.findById(instructor_id);
        if (!instructor) {
            return res.status(404).json({
                status: false,
                message: 'Instructor not found.'
            });
        }

        const away = await Away.create({
            instructor_id,
            date,
            start_time,
            end_time,
            reason,
            status: status || 'Active',
            created_by,
            color
        });

        res.status(201).json({
            status: true,
            message: 'Away record created successfully.',
            away
        });
    } catch (err) {
        next(err);
    }
};

// Get all Away records
exports.getAllAway = async (req, res, next) => {
    try {
        const aways = await Away.find()
            .populate('instructor_id');

        res.status(200).json({
            status: true,
            message: 'Away records fetched successfully.',
            aways
        });
    } catch (err) {
        next(err);
    }
};

// Get Away by ID
exports.getAwayById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const away = await Away.findOne({ _id: id })
            .populate('instructor_id');

        if (!away) {
            return res.status(404).json({ status: false, message: 'Away record not found.' });
        }

        res.status(200).json({
            status: true,
            message: 'Away record fetched successfully.',
            away
        });
    } catch (err) {
        next(err);
    }
};

// Get Away records by Instructor ID
exports.getAwayByInstructor = async (req, res, next) => {
    try {
        const { instructorId } = req.params;

        const aways = await Away.find({ instructor_id: instructorId })
            .populate('instructor_id');

        res.status(200).json({
            status: true,
            message: 'Instructor away records fetched successfully.',
            aways
        });
    } catch (err) {
        next(err);
    }
};

// Update Away
exports.updateAway = async (req, res, next) => {
    try {
        const updated_by = req.user._id;
        const { id } = req.params;

        const updateData = { ...req.body, updated_by };

        const away = await Away.findOneAndUpdate(
            { _id: id },
            updateData,
            { new: true }
        );

        if (!away) {
            return res.status(404).json({ status: false, message: 'Away record not found.' });
        }

        res.status(200).json({
            status: true,
            message: 'Away record updated successfully.',
            away
        });
    } catch (err) {
        next(err);
    }
};

// Delete Away
exports.deleteAway = async (req, res, next) => {
    try {
        const { id } = req.params;

        const away = await Away.findOneAndDelete({ _id: id });

        if (!away) {
            return res.status(404).json({ status: false, message: 'Away record not found.' });
        }

        res.status(200).json({
            status: true,
            message: 'Away record deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
};
