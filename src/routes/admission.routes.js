const express = require('express');
const router = express.Router();
const AdmissionController = require('../controllers/admission.controller');

/**
 * @swagger
 * tags:
 *   name: Admission
 *   description: Admission management
 */

/**
 * @swagger
 * /admissions/search/by-date:
 *   get:
 *     summary: Search for admissions within a date range
 *     tags: [Admission]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date of the range to search for admissions.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date of the range to search for admissions.
 *     responses:
 *       200:
 *         description: A list of admissions found within the date range.
 *       400:
 *         description: Bad request, such as missing date parameters.
 */
router.get('/admissions/search/by-date', AdmissionController.searchByDate);

/**
 * @swagger
 * /admissions:
 *   post:
 *     summary: Create a new admission
 *     tags: [Admission]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admission'
 *     responses:
 *       201:
 *         description: Admission created successfully
 *       400:
 *         description: Bad request
 */
router.post('/admissions/', AdmissionController.createAdmission);

/**
 * @swagger
 * /admissions:
 *   get:
 *     summary: Get all admissions
 *     tags: [Admission]
 *     responses:
 *       200:
 *         description: A list of all admissions.
 */
router.get('/admissions/', AdmissionController.getAdmissions);

/**
 * @swagger
 * /admissions/{id}:
 *   get:
 *     summary: Get a single admission by ID
 *     tags: [Admission]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admission found
 *       404:
 *         description: Admission not found
 */
router.get('/admissions/:id', AdmissionController.getAdmissionById);

/**
 * @swagger
 * /admissions/{id}:
 *   post:
 *     summary: Update an admission
 *     tags: [Admission]
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
 *               roll_no:
 *                 type: string
 *               admission_no:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admission updated successfully
 *       404:
 *         description: Admission not found
 */
router.post('/admissions/:id', AdmissionController.updateAdmission);

/**
 * @swagger
 * /admissions/delete/{id}:
 *   get:
 *     summary: Soft delete an admission
 *     tags: [Admission]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admission soft deleted successfully
 *       404:
 *         description: Admission not found
 */
router.get('/admissions/delete/:id', AdmissionController.deleteAdmission);

/**
 * @swagger
 * /deleted/list:
 *   get:
 *     summary: Get a list of soft-deleted admissions
 *     tags: [Admission]
 *     responses:
 *       200:
 *         description: A list of soft-deleted admissions.
 */
router.get('/deleted/list', AdmissionController.getDeletedAdmissions);

/**
 * @swagger
 * /restore/{id}:
 *   get:
 *     summary: Restore a soft-deleted admission
 *     tags: [Admission]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admission restored successfully
 *       404:
 *         description: Admission not found
 */
router.get('/restore/:id', AdmissionController.restoreAdmission);

/**
 * @swagger
 * /permanent-delete/{id}:
 *   get:
 *     summary: Permanently delete an admission
 *     tags: [Admission]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admission permanently deleted
 *       404:
 *         description: Admission not found
 */
router.get('/permanent-delete/:id', AdmissionController.permanentDeleteAdmission);

module.exports = router;
