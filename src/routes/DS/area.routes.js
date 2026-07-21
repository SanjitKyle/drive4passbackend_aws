const express = require('express');
const router = express.Router();
const AreaController = require('../../controllers/DS/area.controller');

/**
 * @swagger
 * tags:
 *   name: Area
 *   description: Area management
 */

/**
 * @swagger
 * /ds/areas:
 *   post:
 *     summary: Create a new area
 *     tags: [Area]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - address
 *               - contact_email
 *               - phone
 *               - branch_currency
 *               - currency_symbol
 *               - branch_timezones
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               address:
 *                 type: string
 *               contact_email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               branch_currency:
 *                 type: string
 *               currency_symbol:
 *                 type: string
 *               branch_timezones:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Deactive]
 *     responses:
 *       201:
 *         description: Area created successfully
 *       400:
 *         description: Bad request
 */
router.post('/areas', AreaController.createBranch);

/**
 * @swagger
 * /ds/areas:
 *   get:
 *     summary: Get all areas
 *     tags: [Area]
 *     responses:
 *       200:
 *         description: A list of areas
 */
router.get('/areas', AreaController.getAllBranches);

/**
 * @swagger
 * /ds/areas/{id}:
 *   get:
 *     summary: Get an area by ID
 *     tags: [Area]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Area found
 *       404:
 *         description: Area not found
 */
router.get('/areas/:id', AreaController.getBranchById);

/**
 * @swagger
 * /ds/areas/{id}:
 *   post:
 *     summary: Update an area
 *     tags: [Area]
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
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               address:
 *                 type: string
 *               contact_email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               branch_currency:
 *                 type: string
 *               currency_symbol:
 *                 type: string
 *               branch_timezones:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Deactive]
 *     responses:
 *       200:
 *         description: Area updated successfully
 *       404:
 *         description: Area not found
 */
router.post('/areas/:id', AreaController.updateBranch);

/**
 * @swagger
 * /ds/areas/delete/{id}:
 *   post:
 *     summary: Delete an area
 *     tags: [Area]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Area deleted successfully
 *       404:
 *         description: Area not found
 */
router.post('/areas/delete/:id', AreaController.deleteBranch);

module.exports = router;
