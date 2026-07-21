
const auth = require('../../middleware/auth.middleware')
const InstructorController=require('../../controllers/DS/instructor_master.controller');

const express=require('express');
const upload = require('../../config/multer');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Instructor
 *   description: Instructor management
 */

/**
 * @swagger
 * /ds/instructor-masters:
 *   post:
 *     summary: Create a new instructor
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - mobile
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               mobile:
 *                 type: string
 *               school_id:
 *                 type: string
 *               branch_id:
 *                 type: string
 *               instructor_bio:
 *                 type: string
 *               full_address:
 *                 type: string
 *               driving_lichence_number:
 *                 type: string
 *               licence_expiry_date:
 *                 type: string
 *                 format: date
 *               badge_number:
 *                 type: string
 *               badge_expiry_date:
 *                 type: string
 *                 format: date
 *               experience:
 *                 type: number
 *               driving_experience:
 *                 type: number
 *               service_provided_area:
 *                 type: array
 *                 items:
 *                   type: string
 *               transmission_type:
 *                 type: string
 *                 enum: [Manual, Automatic, Both]
 *               work_type:
 *                 type: string
 *                 enum: [Full-time, Part-time, ""]
 *               type:
 *                 type: string
 *                 enum: [ADI, PDI, ""]
 *               start_date:
 *                 type: string
 *                 format: date
 *               franchise_start_date:
 *                 type: string
 *                 format: date
 *               car_make:
 *                 type: string
 *               car_model:
 *                 type: string
 *               car_reg:
 *                 type: string
 *               contract_signed:
 *                 type: string
 *                 enum: [Yes, No]
 *     responses:
 *       201:
 *         description: Instructor created successfully
 *       400:
 *         description: Bad request
 */
router.post("/instructor-masters",  InstructorController.createInstructor);

/**
 * @swagger
 * /ds/instructor-masters:
 *   get:
 *     summary: Get all instructors
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all instructors.
 */
router.get("/instructor-masters",InstructorController.getInstructors);

/**
 * @swagger
 * /ds/instructor-masters/{id}:
 *   get:
 *     summary: Get an instructor by ID
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Instructor found
 *       404:
 *         description: Instructor not found
 */
router.get("/instructor-masters/:id",  InstructorController.getInstructorById);

/**
 * @swagger
 * /ds/instructor-masters/{id}:
 *   post:
 *     summary: Update an instructor
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
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
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Instructor updated successfully
 *       404:
 *         description: Instructor not found
 */
/**
 * @swagger
 * /ds/instructor-masters/{id}:
 *   post:
 *     summary: Update an instructor
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Instructor ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *               instructor_bio:
 *                 type: string
 *               full_address:
 *                 type: string
 *               driving_lichence_number:
 *                 type: string
 *               licence_expiry_date:
 *                 type: string
 *                 format: date
 *               badge_number:
 *                 type: string
 *               badge_expiry_date:
 *                 type: string
 *                 format: date
 *               experience:
 *                 type: number
 *               driving_experience:
 *                 type: number
 *               service_provided_area:
 *                 type: array
 *                 items:
 *                   type: string
 *               transmission_type:
 *                 type: string
 *                 enum: [Manual, Automatic, Both]
 *               work_type:
 *                 type: string
 *                 enum: [Full-time, Part-time, ""]
 *               type:
 *                 type: string
 *                 enum: [ADI, PDI, ""]
 *               start_date:
 *                 type: string
 *                 format: date
 *               franchise_start_date:
 *                 type: string
 *                 format: date
 *               car_make:
 *                 type: string
 *               car_model:
 *                 type: string
 *               car_reg:
 *                 type: string
 *               contract_signed:
 *                 type: string
 *                 enum: [Yes, No]
 *               profile:
 *                 type: string
 *                 format: binary
 *               upload_licence_copy:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Instructor updated successfully
 *       404:
 *         description: Instructor not found
 */


router.post(
  "/instructor-masters/:id",

  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "upload_licence_copy", maxCount: 1 },
  ]),
  InstructorController.updateInstructor
);




/**
 * @swagger
 * /ds/instructor-masters/delete/{id}:
 *   get:
 *     summary: Delete an instructor
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Instructor deleted successfully
 *       404:
 *         description: Instructor not found
 */
router.get("/instructor-masters/delete/:id", InstructorController.deleteInstructor);

/**
 * @swagger
 * /ds/instructor-masters/status/{id}:
 *   get:
 *     summary: Confirm an instructor
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Instructor status updated successfully
 *       404:
 *         description: Instructor not found
 */
router.get("/instructor-masters/status/:id",auth, InstructorController.confirmInstructor)


module.exports = router;
