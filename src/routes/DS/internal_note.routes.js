const express = require('express');
const router = express.Router();
const internalNoteController = require('../../controllers/DS/internal_note.controller');

/**
 * @swagger
 * tags:
 *   name: InternalNotes
 *   description: Internal Notes Management for Enquiries, Instructors, etc.
 */

/**
 * @swagger
 * /ds/internal-notes:
 *   post:
 *     summary: Add or update an internal note
 *     tags: [InternalNotes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entityId
 *               - entityModel
 *               - note
 *             properties:
 *               entityId:
 *                 type: string
 *                 example: "64xyz9876543210abcdef123"
 *               entityModel:
 *                 type: string
 *                 enum: ['Enquire', 'CourseForm', 'AdiTrainingForm', 'InstructorMaster', 'FranchiseEnquiry']
 *                 example: "Enquire"
 *               note:
 *                 type: string
 *                 example: "Called the student, they will confirm tomorrow."
 *     responses:
 *       200:
 *         description: Internal note saved successfully
 *       400:
 *         description: Validation failed (missing fields or invalid entityModel)
 *       500:
 *         description: Server error
 */
router.post('/internal-notes', internalNoteController.addNote);

/**
 * @swagger
 * /ds/internal-notes/{entityModel}/{entityId}:
 *   get:
 *     summary: Get notes for a specific entity
 *     tags: [InternalNotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entityModel
 *         required: true
 *         schema:
 *           type: string
 *           enum: ['Enquire', 'CourseForm', 'AdiTrainingForm', 'InstructorMaster', 'FranchiseEnquiry']
 *         description: The model name of the entity
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the entity
 *     responses:
 *       200:
 *         description: Notes retrieved successfully
 *       400:
 *         description: Missing required params
 *       500:
 *         description: Server error
 */
router.get('/internal-notes/:entityModel/:entityId', internalNoteController.getNotesByEntity);


module.exports = router;
