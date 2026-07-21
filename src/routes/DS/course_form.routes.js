const express = require('express');
const router = express.Router();
const Auth = require('../../middleware/auth.middleware');
const CourseFormController = require('../../controllers/DS/course_form.controller');

/**
 * @swagger
 * tags:
 *   name: CourseForm
 *   description: Course Form Management
 */

/**
 * @swagger
 * /en/course-forms:
 *   post:
 *     summary: Submit a new course form
 *     tags: [CourseForm]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               course_interested:
 *                 type: string
 *                 enum:
 *                   - Not sure
 *                   - 4 Weeks
 *                   - 3 Weeks
 *                   - 2 Weeks
 *                   - 1 Week
 *               previous_lessons:
 *                 type: string
 *                 enum:
 *                   - 0 previous lessons
 *                   - 1-5 lessons
 *                   - 5-10 lessons
 *                   - 10+ lessons
 *                   - 20+ lessons
 *               transmission:
 *                 type: string
 *                 enum:
 *                   - Automatic
 *                   - Manual
 *               postcode:
 *                 type: string
 *                 example: AB12 3CD
 *               additional_message:
 *                 type: string
 *                 example: I am available on weekends.
 *     responses:
 *       200:
 *         description: Course form submitted successfully
 *       500:
 *         description: Server error
 */
router.post('/course-forms', CourseFormController.createCourseForm);

/**
 * @swagger
 * /en/course-forms:
 *   get:
 *     summary: Get all course forms
 *     tags: [CourseForm]
 *     responses:
 *       200:
 *         description: List of course forms retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/course-forms', CourseFormController.getAllCourseForms);

/**
 * @swagger
 * /en/course-forms/{id}:
 *   get:
 *     summary: Get course form by ID
 *     tags: [CourseForm]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course form retrieved successfully
 *       404:
 *         description: Course form not found
 *       500:
 *         description: Server error
 */
router.get('/course-forms/:id', CourseFormController.getCourseFormById);

/**
 * @swagger
 * /en/course-forms/update/{id}:
 *   post:
 *     summary: Update course form
 *     tags: [CourseForm]
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
 *               course_interested:
 *                 type: string
 *               previous_lessons:
 *                 type: string
 *               transmission:
 *                 type: string
 *               postcode:
 *                 type: string
 *               additional_message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course form updated successfully
 *       404:
 *         description: Course form not found
 *       500:
 *         description: Server error
 */
router.post('/course-forms/update/:id', CourseFormController.updateCourseForm);

/**
 * @swagger
 * /en/course-forms/delete/{id}:
 *   post:
 *     summary: Delete course form via POST request
 *     tags: [CourseForm]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course form deleted successfully
 *       404:
 *         description: Course form not found
 *       500:
 *         description: Server error
 */
router.post('/course-forms/delete/:id', CourseFormController.deleteCourseForm);

router.post('/course-forms/updatestatus/:id', Auth, CourseFormController.updateStatus);
router.post('/course-forms/assign/:id', Auth, CourseFormController.assignInstructor);

module.exports = router;
