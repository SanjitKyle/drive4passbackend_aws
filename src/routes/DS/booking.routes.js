const express = require("express");
const router = express.Router();

const BookingController = require("../../controllers/DS/booking.controller");

/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Booking management
 */

/**
 * @swagger
 * /ds/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 *       403:
 *         description: Instructor is not free at this time
 *       404:
 *         description: Instructor or Pupil not found
 */
router.post("/bookings", BookingController.createBooking);


/**
 * @swagger
 * /ds/bookings:
 *   get:
 *     summary: Get all bookings for the school
 *     tags: [Booking]
 *     responses:
 *       200:
 *         description: A list of bookings
 *       404:
 *         description: Could not get bookings
 */
router.get("/bookings", BookingController.getAllBookings);


/**
 * @swagger
 * /ds/bookings/{id}:
 *   get:
 *     summary: Get bookings for a specific instructor
 *     tags: [Booking]
 */
router.get("/bookings/:id", BookingController.getBooking);


/**
 * @swagger
 * /ds/bookings/update-status/{id}:
 *   post:
 *     summary: Update booking status
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
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
 *                 enum: [booking_request, pending, booked, completed, cancelled]
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 */
router.post("/bookings/update-status/:id", BookingController.updateBookingStatus);


/**
 * @swagger
 * /ds/bookings/pupil/{pupil_id}:
 *   get:
 *     summary: Get all bookings by pupil ID
 *     tags: [Booking]
 */
router.get(
  "/bookings/pupil/:pupil_id",
  BookingController.getPupilsBookings
);


/**
 * @swagger
 * /ds/bookings/update/{id}:
 *   post:
 *     summary: Update booking details
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: Booking updated successfully
 */
router.post(
  "/bookings/update/:id",
  BookingController.updateBooking
);


module.exports = router;
