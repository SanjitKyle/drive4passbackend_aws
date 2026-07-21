const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/course.controller');

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Course]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course_name
 *               - course_description
 *               - course_price
 *               - course_category
 *               - course_section
 *               - school_id
 *               - branch_id
 *             properties:
 *               course_name:
 *                 type: string
 *               course_description:
 *                 type: string
 *               course_price:
 *                 type: number
 *               course_category:
 *                 type: string
 *               course_section:
 *                 type: string
 *               school_id:
 *                 type: string
 *               branch_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Bad request
 */
router.post('/courses/', CourseController.createCourse);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: A list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal Server Error
 */
router.get('/courses/', CourseController.getCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to retrieve
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 */
router.get('/courses/:id', CourseController.getCourseById);

/**
 * @swagger
 * /courses/{id}:
 *   post:
 *     summary: Update a course
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_name:
 *                 type: string
 *               course_description:
 *                 type: string
 *               course_price:
 *                 type: number
 *               course_category:
 *                 type: string
 *               course_section:
 *                 type: string
 *               status:
 *                 type: number
 *                 description: 0 for inactive, 1 for active
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Invalid request or course not found
 */
router.post('/courses/:id', CourseController.updateCourse);

/**
 * @swagger
 * /courses/delete/{id}:
 *   get:
 *     summary: Delete a course
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to delete
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       400:
 *         description: Course not found
 */
router.get('/courses/delete/:id', CourseController.deleteCourse);

module.exports = router;
