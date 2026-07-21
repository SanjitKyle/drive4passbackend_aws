const express = require('express');
const router = express.Router();
const specializationController = require('../controllers/specialization.controller');

/**
 * @swagger
 * tags:
 *   name: Specialization
 *   description: Specialization management
 */

/**
 * @swagger
 * /specializations:
 *   post:
 *     summary: Create a new specialization
 *     tags: [Specialization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - specialization_name
 *               - course_id
 *             properties:
 *               specialization_name:
 *                 type: string
 *               course_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Specialization created successfully
 *       400:
 *         description: Bad request
 */
router.post('/specializations/', specializationController.createSpecialization);

/**
 * @swagger
 * /specializations:
 *   get:
 *     summary: Get all specializations
 *     tags: [Specialization]
 *     responses:
 *       200:
 *         description: A list of all specializations.
 */
router.get('/specializations/', specializationController.getSpecializations);

/**
 * @swagger
 * /specializations/{id}:
 *   post:
 *     summary: Update a specialization
 *     tags: [Specialization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialization_name:
 *                 type: string
 *               status:
 *                 type: integer
 *                 description: 0 for inactive, 1 for active
 *     responses:
 *       200:
 *         description: Specialization updated successfully
 *       404:
 *         description: Specialization not found
 */
router.post('/specializations/:id', specializationController.updateSpecialization);

/**
 * @swagger
 * /specializations/delete/{id}:
 *   get:
 *     summary: Delete a specialization
 *     tags: [Specialization]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Specialization deleted successfully
 *       404:
 *         description: Specialization not found
 */
router.get('/specializations/delete/:id', specializationController.deleteSpecialization);

module.exports = router;
