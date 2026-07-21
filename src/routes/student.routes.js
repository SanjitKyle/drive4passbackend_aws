const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/student.controller');

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Student management
 */

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student and their admission record
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       "201":
 *         description: Student and Admission created successfully
 *       "400":
 *         description: Bad request
 *       "500":
 *         description: Internal Server Error
 */
router.post('/students/', StudentController.createStudent);

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students for the branch
 *     tags: [Student]
 *     description: Retrieves a list of all students for the authenticated user's branch. Requires authentication.
 *     responses:
 *       "200":
 *         description: A list of students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *       "500":
 *         description: Internal Server Error
 */
router.get('/students/', StudentController.getAllStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to retrieve
 *     responses:
 *       "200":
 *         description: Student data
 *       "400":
 *         description: Student not found
 *       "500":
 *         description: Internal Server Error
 */
router.get('/students/:id', StudentController.getStudentById);

/**
 * @swagger
 * /students/{id}/profile:
 *   post:
 *     summary: Update or create a student profile
 *     tags: [Student]
 *     description: Updates a student's profile by their ID. If the student ID does not exist, a new student will be created.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to update or create
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       "200":
 *         description: Student profile updated successfully
 *       "201":
 *         description: New student created successfully
 *       "500":
 *         description: Internal Server Error
 */
router.post('/students/:id/profile', StudentController.updateStudentProfile);

/**
 * @swagger
 * /students/enable-login/{student_id}:
 *   post:
 *     summary: Enable login for a student
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: student_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to enable login for.
 *     responses:
 *       "200":
 *         description: Student login enabled successfully
 *       "400":
 *         description: Bad request (e.g., student ID is required, or login is already enabled)
 *       "404":
 *         description: Student not found
 *       "500":
 *         description: Internal Server Error
 */
router.post('/students/enable-login/:student_id', StudentController.enableStudentLogin);

/**
 * @swagger
 * /students/login-details/{student_id}:
 *   get:
 *     summary: Get login details for a student
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: student_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to fetch login details for.
 *     responses:
 *       "200":
 *         description: Login details fetched successfully
 *       "404":
 *         description: Student not found
 *       "500":
 *         description: Internal Server Error
 */
router.get('/students/login-details/:student_id', StudentController.getLoginDetails);

/**
 * @swagger
 * /students/disable-login/{student_id}:
 *   post:
 *     summary: Disable login for a student
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: student_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to disable login for.
 *     responses:
 *       "200":
 *         description: Student login disabled successfully
 *       "400":
 *         description: Bad request (e.g., student ID is required, or login is not enabled)
 *       "404":
 *         description: Student or associated user not found
 *       "500":
 *         description: Internal Server Error
 */
router.post('/students/disable-login/:student_id', StudentController.disableStudentLogin);

/**
 * @swagger
 * /students/my-profile/{student_id}:
 *   get:
 *     summary: Get a student's profile by their ID
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: student_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to retrieve their profile
 *     responses:
 *       "200":
 *         description: Student profile data
 *       "400":
 *         description: Student not found
 *       "500":
 *         description: Internal Server Error
 */
router.get('/students/my-profile/:student_id', StudentController.getStudentProfile);

module.exports = router;
