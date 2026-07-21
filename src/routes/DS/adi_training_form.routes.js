const express = require('express');
const router = express.Router();
const AdiTrainingFormController = require('../../controllers/DS/adi_training_form.controller');

/**
 * @swagger
 * tags:
 *   name: AdiTrainingForm
 *   description: ADI Training Form Management
 */

/**
 * @swagger
 * /en/adi-training-forms:
 *   post:
 *     summary: Submit a new ADI Training form
 *     tags: [AdiTrainingForm]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               training_status:
 *                 type: string
 *                 enum:
 *                   - None
 *                   - Started Part 1
 *                   - Passed Part 1
 *                   - Passed Part 2
 *               franchise_status:
 *                 type: string
 *                 enum:
 *                   - YES
 *                   - NO
 *               postcode:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: ADI Training form submitted successfully
 *       500:
 *         description: Server error
 */
router.post('/adi-training-forms', AdiTrainingFormController.createAdiTrainingForm);

/**
 * @swagger
 * /en/adi-training-forms:
 *   get:
 *     summary: Get all ADI Training forms
 *     tags: [AdiTrainingForm]
 *     responses:
 *       200:
 *         description: List of ADI Training forms retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/adi-training-forms', AdiTrainingFormController.getAllAdiTrainingForms);

/**
 * @swagger
 * /en/adi-training-forms/{id}:
 *   get:
 *     summary: Get ADI Training form by ID
 *     tags: [AdiTrainingForm]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ADI Training form retrieved successfully
 *       404:
 *         description: ADI Training form not found
 *       500:
 *         description: Server error
 */
router.get('/adi-training-forms/:id', AdiTrainingFormController.getAdiTrainingFormById);

/**
 * @swagger
 * /en/adi-training-forms/update/{id}:
 *   post:
 *     summary: Update ADI Training form
 *     tags: [AdiTrainingForm]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               training_status:
 *                 type: string
 *               franchise_status:
 *                 type: string
 *               postcode:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: ADI Training form updated successfully
 *       404:
 *         description: ADI Training form not found
 *       500:
 *         description: Server error
 */
router.post('/adi-training-forms/update/:id', AdiTrainingFormController.updateAdiTrainingForm);

/**
 * @swagger
 * /en/adi-training-forms/delete/{id}:
 *   post:
 *     summary: Delete ADI Training form via POST request
 *     tags: [AdiTrainingForm]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ADI Training form deleted successfully
 *       404:
 *         description: ADI Training form not found
 *       500:
 *         description: Server error
 */
router.post('/adi-training-forms/delete/:id', AdiTrainingFormController.deleteAdiTrainingForm);

module.exports = router;
