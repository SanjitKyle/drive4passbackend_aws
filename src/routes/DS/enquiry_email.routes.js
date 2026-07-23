const express = require("express");
const router = express.Router();
const Auth = require('../../middleware/auth.middleware');
const EnquireController = require("../../controllers/DS/enquire.controller");

/**
 * @swagger
 * tags:
 *   name: Enquiry Emails
 *   description: Driving School Enquiry Email Management
 */

/**
 * @swagger
 * /en/enquiries/send-resource-pack:
 *   post:
 *     summary: Send resource pack email to an enquiry
 *     tags: [Enquiry Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enquiry_id:
 *                 type: string
 *               resource_link:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Email sent successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Enquiry not found
 *       "500":
 *         description: Internal Server Error
 */
router.post('/enquiries/send-resource-pack', EnquireController.sendResourcePack);

/**
 * @swagger
 * /en/enquiries/send-review-link:
 *   post:
 *     summary: Send review link email to an enquiry
 *     tags: [Enquiry Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enquiry_id:
 *                 type: string
 *               review_link:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Email sent successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Enquiry not found
 *       "500":
 *         description: Internal Server Error
 */
router.post('/enquiries/send-review-link', EnquireController.sendReviewLink);

/**
 * @swagger
 * /en/enquiries/send-welcome-message:
 *   post:
 *     summary: Send welcome message email to an enquiry
 *     tags: [Enquiry Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enquiry_id:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Email sent successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Enquiry not found
 *       "500":
 *         description: Internal Server Error
 */
router.post('/enquiries/send-welcome-message', EnquireController.sendWelcomeMessage);

/**
 * @swagger
 * /en/enquiries/{id}/email-logs:
 *   get:
 *     summary: Get all email logs for a specific enquiry
 *     tags: [Enquiry Emails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquiry ID
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/enquiries/:id/email-logs', EnquireController.getEmailLogs);

module.exports = router;
