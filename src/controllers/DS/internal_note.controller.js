const InternalNote = require('../../models/DS/internal_note.model');

// Add a new internal note
exports.addNote = async (req, res) => {
    try {
        const { entityId, entityModel, note } = req.body;
        // Assuming req.user is set by auth middleware, otherwise you can pass createdBy from body
        const createdBy = req.user ? req.user._id : req.body.createdBy;

        if (!entityId || !entityModel || !note) {
            return res.status(400).json({ error: 'entityId, entityModel, and note are required fields' });
        }

        const validModels = ['Enquire', 'CourseForm', 'AdiTrainingForm', 'InstructorMaster', 'FranchiseEnquiry'];
        if (!validModels.includes(entityModel)) {
            return res.status(400).json({ error: 'Invalid entityModel' });
        }

        // Upsert: If a note exists for this entity, update it. Otherwise, create a new one.
        const updatedNote = await InternalNote.findOneAndUpdate(
            { entityId, entityModel },
            { note, createdBy },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'Internal note saved successfully',
            note: updatedNote
        });
    } catch (error) {
        console.error('Error adding internal note:', error);
        res.status(500).json({ error: 'Internal server error while adding note' });
    }
};

// Get all notes for a specific entity
exports.getNotesByEntity = async (req, res) => {
    try {
        const { entityModel, entityId } = req.params;

        if (!entityId || !entityModel) {
            return res.status(400).json({ error: 'entityModel and entityId are required in params' });
        }

        const notes = await InternalNote.find({ entityId, entityModel })
            .populate('createdBy', 'name email') // Populate user details if needed
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({
            message: 'Notes retrieved successfully',
            notes
        });
    } catch (error) {
        console.error('Error fetching internal notes:', error);
        res.status(500).json({ error: 'Internal server error while fetching notes' });
    }
};

// Delete a note
exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedNote = await InternalNote.findByIdAndDelete(id);

        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json({
            message: 'Note deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting internal note:', error);
        res.status(500).json({ error: 'Internal server error while deleting note' });
    }
};
