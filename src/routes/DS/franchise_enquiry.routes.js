const express = require('express');
const router = express.Router();
const FranchiseEnquiryController = require('../../controllers/DS/franchise_enquiry.controller');

/**
 * @swagger
 * tags:
 *   name: FranchiseEnquiry
 *   description: Franchise Enquiry Management
 */

/**
 * @swagger
 * /en/franchise-enquiries:
 *   post:
 *     summary: Submit a new Franchise enquiry
 *     tags: [FranchiseEnquiry]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               instructor_type:
 *                 type: string
 *                 enum:
 *                   - ADI
 *                   - PDI
 *               franchise_status:
 *                 type: string
 *                 enum:
 *                   - YES
 *                   - NO
 *               postcode:
 *                 type: string
 *               message:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - New
 *                   - Contacted
 *                   - Under review
 *                   - Waiting list
 *                   - Converted to instructor
 *                   - No response
 *     responses:
 *       200:
 *         description: Franchise enquiry submitted successfully
 *       500:
 *         description: Server error
 */
router.post('/franchise-enquiries', FranchiseEnquiryController.createFranchiseEnquiry);

/**
 * @swagger
 * /en/franchise-enquiries:
 *   get:
 *     summary: Get all Franchise enquiries
 *     tags: [FranchiseEnquiry]
 *     responses:
 *       200:
 *         description: List of Franchise enquiries retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/franchise-enquiries', FranchiseEnquiryController.getAllFranchiseEnquiries);

/**
 * @swagger
 * /en/franchise-enquiries/{id}:
 *   get:
 *     summary: Get Franchise enquiry by ID
 *     tags: [FranchiseEnquiry]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Franchise enquiry retrieved successfully
 *       404:
 *         description: Franchise enquiry not found
 *       500:
 *         description: Server error
 */
router.get('/franchise-enquiries/:id', FranchiseEnquiryController.getFranchiseEnquiryById);

/**
 * @swagger
 * /en/franchise-enquiries/update/{id}:
 *   post:
 *     summary: Update Franchise enquiry
 *     tags: [FranchiseEnquiry]
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
 *               first_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               instructor_type:
 *                 type: string
 *               franchise_status:
 *                 type: string
 *               postcode:
 *                 type: string
 *               message:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - New
 *                   - Contacted
 *                   - Under review
 *                   - Waiting list
 *                   - Converted to instructor
 *                   - No response
 *     responses:
 *       200:
 *         description: Franchise enquiry updated successfully
 *       404:
 *         description: Franchise enquiry not found
 *       500:
 *         description: Server error
 */
router.post('/franchise-enquiries/update/:id', FranchiseEnquiryController.updateFranchiseEnquiry);

/**
 * @swagger
 * /en/franchise-enquiries/delete/{id}:
 *   post:
 *     summary: Delete Franchise enquiry via POST request
 *     tags: [FranchiseEnquiry]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Franchise enquiry deleted successfully
 *       404:
 *         description: Franchise enquiry not found
 *       500:
 *         description: Server error
 */
router.post('/franchise-enquiries/delete/:id', FranchiseEnquiryController.deleteFranchiseEnquiry);

module.exports = router;
