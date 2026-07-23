const express = require('express');
const router = express.Router();
const {
  sendResourcePack,
  sendReviewLink,
  sendWelcomeMessage,
  getEmailLogs
} = require('../../controllers/DS/course_form.controller');
const { isAuthenticatedUser } = require('../../middleware/auth');

/**
 * @swagger
 * /en/course-form/send-resource-pack:
 *   post:
 *     summary: Send resource pack email to a course form submission
 *     tags: [Course Form Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course_form_id
 *             properties:
 *               course_form_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Course form not found
 */
router.post('/course-form/send-resource-pack', sendResourcePack);

/**
 * @swagger
 * /en/course-form/send-review-link:
 *   post:
 *     summary: Send review link email to a course form submission
 *     tags: [Course Form Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course_form_id
 *               - review_link
 *             properties:
 *               course_form_id:
 *                 type: string
 *               review_link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Course form not found
 */
router.post('/course-form/send-review-link', sendReviewLink);

/**
 * @swagger
 * /en/course-form/send-welcome-message:
 *   post:
 *     summary: Send welcome message email to a course form submission
 *     tags: [Course Form Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course_form_id
 *             properties:
 *               course_form_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Course form not found
 */
router.post('/course-form/send-welcome-message', sendWelcomeMessage);

/**
 * @swagger
 * /en/course-form/{id}/email-logs:
 *   get:
 *     summary: Get all email logs for a specific course form
 *     tags: [Course Form Emails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course form ID
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/course-form/:id/email-logs', getEmailLogs);

module.exports = router;
