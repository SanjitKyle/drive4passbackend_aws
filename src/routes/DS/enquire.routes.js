const express = require("express");
const router = express.Router();
const Auth=require('../../middleware/auth.middleware');
const EnquireController = require("../../controllers/DS/enquire.controller");

/**
 * @swagger
 * tags:
 *   name: Enquiry
 *   description: Driving School Enquiry Management
 */

/**
 * @swagger
 * /en/enquiries:
 *   post:
 *     summary: Create a new driving school enquiry
 *     tags: [Enquiry]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - postcode
 *               - source
 *               - additional_message
 *               - driving_experience
 *               - type_of_training
 *               - licence
 *               - lesson_preference_time
 *               - preferred_start_date
 *               - preferred_contact_method
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rahul Sharma
 *               email:
 *                 type: string
 *                 example: rahul@gmail.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               postcode:
 *                 type: string
 *                 example: Salt Lake, Kolkata
 *               driving_experience:
 *                 type: string
 *                 enum:
 *                   - Beginner
 *                   - Some Experience
 *                   - Experienced
 *               type_of_training:
 *                 type: string
 *                 enum:
 *                   - Car Driving Lessons
 *                   - Automatic Car Lessons
 *                   - Manual Car Lessons
 *                   - Refresher Lessons
 *                   - Intensive Course
 *               licence:
 *                 type: string
 *                 enum:
 *                   - Yes
 *                   - No
 *               lesson_preference_time:
 *                 type: string
 *                 enum:
 *                   - Morning
 *                   - Afternoon
 *                   - Evening
 *               preferred_start_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-15"
 *               preferred_contact_method:
 *                 type: string
 *                 enum:
 *                   - Phone Call
 *                   - WhatsApp
 *                   - Email
 *               source:
 *                 type: string
 *                 enum:
 *                   - Google
 *                   - Facebook
 *                   - Instagram
 *                   - Referral
 *                   - Website
 *                   - Other
 *               additional_message:
 *                 type: string
 *                 example: I would like weekend driving lessons.
 *     responses:
 *       201:
 *         description: Enquiry submitted successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
router.post("/enquiries", EnquireController.createEnquiry);

/**
 * @swagger
 * /en/enquiries:
 *   get:
 *     summary: Get all enquiries
 *     tags: [Enquiry]
 *     responses:
 *       200:
 *         description: List of enquiries retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/enquiries", EnquireController.getAllEnquiries);

/**
 * @swagger
 * /en/enquiries/{id}:
 *   get:
 *     summary: Get enquiry by ID
 *     tags: [Enquiry]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquiry ID
 *     responses:
 *       200:
 *         description: Enquiry retrieved successfully
 *       404:
 *         description: Enquiry not found
 *       500:
 *         description: Server error
 */
router.get("/enquiries/:id", EnquireController.getEnquiryById);

/**
 * @swagger
 * /en/enquiries/updatestatus/{id}:
 *   post:
 *     summary: Update enquiry status
 *     tags: [Enquiry]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquiry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - New
 *                   - Contacted
 *                   - Booked
 *                   - Waiting list
 *                   - No Response
 *                   - Test-Only Enquiry
 *                   - Passed to Office
 *                   - Quoted / Price Given
 *                   - Call Back Later
 *                   - Lost
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Enquiry not found
 *       500:
 *         description: Server error
 */
router.post(
  "/enquiries/updatestatus/:id",Auth,
  EnquireController.updateEnquiryStatus
);

/**
 * @swagger
 * /en/enquiries/instructorassign/{id}:
 *   post:
 *     summary: Assign instructor to enquiry
 *     tags: [Enquiry]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquiry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - instructor_id
 *             properties:
 *               instructor_id:
 *                 type: string
 *                 example: 685a1234567890abcdef1234
 *     responses:
 *       200:
 *         description: Instructor assigned successfully
 *       400:
 *         description: Instructor ID is required
 *       404:
 *         description: Enquiry not found
 *       500:
 *         description: Server error
 */
router.post(
  "/enquiries/instructorassign/:id",Auth,
  EnquireController.assignInstructor
);

/**
 * @swagger
 * /en/enquiries/delete/{id}:
 *   post:
 *     summary: Delete enquiry
 *     tags: [Enquiry]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquiry ID
 *     responses:
 *       200:
 *         description: Enquiry deleted successfully
 *       404:
 *         description: Enquiry not found
 *       500:
 *         description: Server error
 */
router.post("/enquiries/delete/:id", EnquireController.deleteEnquiry);

/**
 * @swagger
 * /en/enquiries/instructor/enquiries/{id}:
 *   get:
 *     summary: Get enquiries by instructor ID
 *     tags: [Enquiry]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Instructor ID
 *     responses:
 *       200:
 *         description: Instructor enquiries retrieved successfully
 *       404:
 *         description: No enquiries found for this instructor
 *       500:
 *         description: Server error
 */
router.get(
  "/enquiries/instructor/enquiries/:id",
  EnquireController.getEnquiryByInstructor
);

/**
 * @swagger
 * /en/enquiries/seen:
 *   post:
 *     summary: Mark all unseen enquiries as seen
 *     tags: [Enquiry]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All enquiries marked as seen successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully marked all enquiries as seen
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: No unseen enquiries found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No unseen enquiries found
 *                 success:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Server error
 */
router.post(
  "/enquiries/seen/:id",
  Auth,
  EnquireController.SeenEnquiry
);

/**
 * @swagger
 * /en/update-enquiry-status/{id}:
 *   post:
 *     summary: Update enquiry status
 *     tags: [Enquiry]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Enquiry ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - enquiry_status
 *             properties:
 *               enquiry_status:
 *                 type: string
 *                 enum: ['confirmed', 'not confirmed']
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Enquiry status updated successfully
 *       404:
 *         description: Enquiry not found
 *       500:
 *         description: Server error
 */
router.post("/update-enquiry-status/:id", EnquireController.updateStatus);

/**
 * @swagger
 * /en/enquiries/{id}:
 *   post:
 *     summary: Update an existing enquiry
 *     tags: [Enquiry]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Enquiry ID
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
 *                 example: Rahul Sharma Updated
 *               email:
 *                 type: string
 *                 example: rahul.updated@gmail.com
 *               phone:
 *                 type: string
 *                 example: "9876543211"
 *               postcode:
 *                 type: string
 *                 example: Salt Lake, Kolkata
 *               driving_experience:
 *                 type: string
 *                 enum:
 *                   - Beginner
 *                   - Some Experience
 *                   - Experienced
 *               type_of_training:
 *                 type: string
 *                 enum:
 *                   - Car Driving Lessons
 *                   - Automatic Car Lessons
 *                   - Manual Car Lessons
 *                   - Refresher Lessons
 *                   - Intensive Course
 *               licence:
 *                 type: string
 *                 enum:
 *                   - Yes
 *                   - No
 *               lesson_preference_time:
 *                 type: string
 *                 enum:
 *                   - Morning
 *                   - Afternoon
 *                   - Evening
 *               preferred_start_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-07-15"
 *               preferred_contact_method:
 *                 type: string
 *                 enum:
 *                   - Phone Call
 *                   - WhatsApp
 *                   - Email
 *               source:
 *                 type: string
 *                 enum:
 *                   - Google
 *                   - Facebook
 *                   - Instagram
 *                   - Referral
 *                   - Website
 *                   - Other
 *               additional_message:
 *                 type: string
 *                 example: Updated message here.
 *     responses:
 *       200:
 *         description: Enquiry updated successfully
 *       404:
 *         description: Enquiry not found
 *       500:
 *         description: Server error
 */
router.post("/enquiries/:id", Auth, EnquireController.editEnquiry);

module.exports = router;
