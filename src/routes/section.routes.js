const express = require('express');
const router = express.Router();
const SectionController = require('../controllers/section.controller');

/**
 * @swagger
 * /sections:
 *   post:
 *     summary: Create a new section
 *     tags: [Section]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - section_name
 *             properties:
 *               section_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Section created successfully
 *       400:
 *         description: Bad request
 */
router.post('/sections/', SectionController.createSection);

/**
 * @swagger
 * /sections:
 *   get:
 *     summary: Get all sections
 *     tags: [Section]
 *     responses:
 *       200:
 *         description: A list of sections
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 sections:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal Server Error
 */
router.get('/sections/', SectionController.getSections);

/**
 * @swagger
 * /sections/{id}:
 *   post:
 *     summary: Update a section
 *     tags: [Section]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the section to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               section_name:
 *                 type: string
 *               status:
 *                 type: number
 *                 description: 0 for inactive, 1 for active
 *     responses:
 *       200:
 *         description: Section updated successfully
 *       400:
 *         description: Invalid request or section not found
 */
router.post('/sections/:id', SectionController.updateSection);

/**
 * @swagger
 * /sections/delete/{id}:
 *   get:
 *     summary: Delete a section
 *     tags: [Section]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the section to delete
 *     responses:
 *       200:
 *         description: Section deleted successfully
 *       400:
 *         description: Section not found
 */
router.get('/sections/delete/:id', SectionController.deleteSection);

module.exports = router;
