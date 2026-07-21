const express = require('express');
const router = express.Router();
const BranchController = require('../controllers/branch.controller');

/**
 * @swagger
 * tags:
 *   name: Branch
 *   description: Branch management
 */

/**
 * @swagger
 * /branchs:
 *   post:
 *     summary: Create a new branch
 *     tags: [Branch]
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
 *               - postcode
 *               - contact_email
 *               - phone
 *               - branch_currency
 *               - currency_symbol
 *               - branch_timezones
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *                 example: London Branch
 *               code:
 *                 type: string
 *                 example: LON001
 *               address:
 *                 type: string
 *                 example: 123 Oxford Street, London
 *               postcode:
 *                 type: string
 *                 example: SW1A 1AA
 *               contact_email:
 *                 type: string
 *                 format: email
 *                 example: london@example.com
 *               phone:
 *                 type: string
 *                 example: "+441234567890"
 *               branch_currency:
 *                 type: string
 *                 example: GBP
 *               currency_symbol:
 *                 type: string
 *                 example: £
 *               branch_timezones:
 *                 type: string
 *                 example: Europe/London
 *               status:
 *                 type: string
 *                 enum: [Active, Deactive]
 *                 example: Active
 *     responses:
 *       201:
 *         description: Branch created successfully
 *       400:
 *         description: Bad request
 */
router.post('/branchs/', BranchController.createBranch);

/**
 * @swagger
 * /branchs:
 *   get:
 *     summary: Get all branches
 *     tags: [Branch]
 *     responses:
 *       200:
 *         description: List of all branches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       code:
 *                         type: string
 *                       address:
 *                         type: string
 *                       postcode:
 *                         type: string
 *                       contact_email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       branch_currency:
 *                         type: string
 *                       currency_symbol:
 *                         type: string
 *                       branch_timezones:
 *                         type: string
 *                       status:
 *                         type: string
 */
router.get('/branchs/', BranchController.getAllBranches);

/**
 * @swagger
 * /branchs/{id}:
 *   get:
 *     summary: Get a branch by ID
 *     tags: [Branch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch details retrieved successfully
 *       404:
 *         description: Branch not found
 */
router.get('/branchs/:id', BranchController.getBranchById);

/**
 * @swagger
 * /branchs/{id}:
 *   post:
 *     summary: Update a branch
 *     tags: [Branch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
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
 *               postcode:
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
 *         description: Branch updated successfully
 *       404:
 *         description: Branch not found
 */
router.post('/branchs/:id', BranchController.updateBranch);

/**
 * @swagger
 * /branchs/delete/{id}:
 *   get:
 *     summary: Delete a branch
 *     tags: [Branch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch deleted successfully
 *       404:
 *         description: Branch not found
 */
router.get('/branchs/delete/:id', BranchController.deleteBranch);
module.exports = router;