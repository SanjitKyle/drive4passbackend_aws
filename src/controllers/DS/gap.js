const Gap = require('../../models/DS/gap');
const Booking = require('../../models/DS/booking.model');
const InstructorMaster = require('../../models/DS/instructor_master.model');
const Pupil = require('../../models/DS/pupil.model');
const getTotalHours = require('../../utils/timeDifferent');
const { createCreditLog } = require('./pupil_credits_log.controller');
const NotificationToken = require('../../models/DS/fcmtokenstore');
const NotificationStore = require('../../models/DS/notification_stored');
const { sendNotification } = require('./message_token_store');

// Helper to parse duration into hours, minutes, total hours, and formatted string
function parseDuration(reqBody) {
    let hours = 0;
    let minutes = 0;

    const { duration_hours, duration_minutes, hours: h, minutes: m, duration } = reqBody;

    if (duration_hours !== undefined || duration_minutes !== undefined) {
        hours = Number(duration_hours) || 0;
        minutes = Number(duration_minutes) || 0;
    } else if (h !== undefined || m !== undefined) {
        hours = Number(h) || 0;
        minutes = Number(m) || 0;
    } else if (typeof duration === 'number') {
        hours = Math.floor(duration);
        minutes = Math.round((duration - hours) * 60);
    } else if (typeof duration === 'string' && duration.trim() !== '') {
        const str = duration.trim();
        if (str.includes(':')) {
            const parts = str.split(':');
            hours = Number(parts[0]) || 0;
            minutes = Number(parts[1]) || 0;
        } else if (str.toLowerCase().includes('h') || str.toLowerCase().includes('m')) {
            const hMatch = str.match(/(\d+)\s*h/i);
            const mMatch = str.match(/(\d+)\s*m/i);
            hours = hMatch ? Number(hMatch[1]) : 0;
            minutes = mMatch ? Number(mMatch[1]) : 0;
        } else {
            const num = Number(str);
            if (!isNaN(num)) {
                hours = Math.floor(num);
                minutes = Math.round((num - hours) * 60);
            }
        }
    }

    if (minutes >= 60) {
        hours += Math.floor(minutes / 60);
        minutes = minutes % 60;
    }

    const totalHours = hours + (minutes / 60);

    let formatted = '';
    if (hours > 0) formatted += `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    if (minutes > 0) formatted += `${formatted ? ' ' : ''}${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
    if (!formatted) formatted = '0 mins';

    return {
        duration_hours: hours,
        duration_minutes: minutes,
        total_hours: totalHours,
        formatted
    };
}

// Helper to calculate end_time from start_time + hours/minutes
function calculateEndTime(startTimeStr, hours, minutes) {
    if (!startTimeStr) return null;
    let cleanTime = String(startTimeStr).trim();
    let [timePart, modifier] = cleanTime.split(' ');
    let [h, m] = timePart.split(':').map(Number);
    if (isNaN(h)) return null;
    m = isNaN(m) ? 0 : m;

    if (modifier) {
        modifier = modifier.toUpperCase();
        if (modifier === 'PM' && h < 12) h += 12;
        if (modifier === 'AM' && h === 12) h = 0;
    }

    let endTotalMins = (h * 60 + m) + (hours * 60 + minutes);
    let endH = Math.floor(endTotalMins / 60) % 24;
    let endM = endTotalMins % 60;

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(endH)}:${pad(endM)}`;
}

// Create Gap
exports.createGap = async (req, res, next) => {
    try {
        const school_id = req.user.school_id;
        const { date, start_time, instructor } = req.body;

        const durationInfo = parseDuration(req.body);

        const gap = await Gap.create({
            school_id,
            date,
            start_time,
            duration_hours: durationInfo.duration_hours,
            duration_minutes: durationInfo.duration_minutes,
            duration_formatted: durationInfo.formatted,
            duration: durationInfo.total_hours,
            instructor: instructor || null
        });

        res.status(201).json({
            status: true,
            message: 'Gap created successfully',
            gap
        });
    } catch (err) {
        next(err);
    }
};

// Get all Gaps
exports.getAllGaps = async (req, res, next) => {
    try {
        const school_id = req.user.school_id;

        const gaps = await Gap.find({ school_id })

            .populate('instructor');

        res.status(200).json({
            status: true,
            message: 'Gaps fetched successfully',
            gaps
        });
    } catch (err) {
        next(err);
    }
};

// Get Gap by ID
exports.getGapById = async (req, res, next) => {
    try {
        const school_id = req.user.school_id;
        const { id } = req.params;

        const gap = await Gap.findOne({ _id: id, school_id })

            .populate('instructor');

        if (!gap) {
            return res.status(404).json({ status: false, message: 'Gap not found' });
        }

        res.status(200).json({
            status: true,
            message: 'Gap data fetched successfully',
            gap
        });
    } catch (err) {
        next(err);
    }
};

// Get Gaps by Instructor ID
exports.getGapsByInstructor = async (req, res, next) => {
    try {
        const school_id = req.user.school_id;
        const { instructorId } = req.params;

        const gaps = await Gap.find({ instructor: instructorId, school_id })

            .populate('instructor');

        res.status(200).json({
            status: true,
            message: 'Instructor gaps fetched successfully',
            gaps
        });
    } catch (err) {
        next(err);
    }
};

// Update Gap
exports.updateGap = async (req, res, next) => {
    try {
        const school_id = req.user.school_id;
        const { id } = req.params;

        const updateData = { ...req.body };

        if (
            req.body.duration !== undefined ||
            req.body.duration_hours !== undefined ||
            req.body.duration_minutes !== undefined ||
            req.body.hours !== undefined ||
            req.body.minutes !== undefined
        ) {
            const durationInfo = parseDuration(req.body);
            updateData.duration_hours = durationInfo.duration_hours;
            updateData.duration_minutes = durationInfo.duration_minutes;
            updateData.duration_formatted = durationInfo.formatted;
            updateData.duration = durationInfo.total_hours;
        }

        const gap = await Gap.findOneAndUpdate(
            { _id: id, school_id },
            updateData,
            { new: true }
        );

        if (!gap) {
            return res.status(404).json({ status: false, message: 'Gap not found' });
        }

        res.status(200).json({
            status: true,
            message: 'Gap updated successfully',
            gap
        });
    } catch (err) {
        next(err);
    }
};

// Delete Gap
exports.deleteGap = async (req, res, next) => {
    try {
        const school_id = req.user.school_id;
        const { id } = req.params;

        const gap = await Gap.findOneAndDelete({ _id: id, school_id });

        if (!gap) {
            return res.status(404).json({ status: false, message: 'Gap not found' });
        }

        res.status(200).json({
            status: true,
            message: 'Gap deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};

// Convert Gap to Booking
exports.convertGapToBooking = async (req, res, next) => {
    try {
        const school_id = req.user.school_id;
        const created_by = req.user._id;
        const gapId = req.params.id || req.body.gap_id;

        if (!gapId) {
            return res.status(400).json({
                success: false,
                message: 'Gap ID is required'
            });
        }

        const gap = await Gap.findOne({ _id: gapId, school_id });
        if (!gap) {
            return res.status(404).json({
                success: false,
                message: 'Gap record not found'
            });
        }

        const {
            pupil_id,
            instructor_id,
            title,
            booking_date,
            start_time,
            end_time: reqEndTime,
            repeat,
            gearbox,
            pickup,
            dropoff,
            private_notes,
            pupil_summary,
            status,
            sell_id
        } = req.body;

        const targetInstructorId = instructor_id || gap.instructor;
        const targetBookingDate = booking_date || (gap.date instanceof Date ? gap.date.toISOString().split('T')[0] : String(gap.date || '').split('T')[0]);
        const targetStartTime = start_time || gap.start_time;

        let computedEndTime = reqEndTime;
        if (!computedEndTime && targetStartTime) {
            const h = gap.duration_hours || (typeof gap.duration === 'number' ? Math.floor(gap.duration) : 0);
            const m = gap.duration_minutes || (typeof gap.duration === 'number' ? Math.round((gap.duration - h) * 60) : 0);
            computedEndTime = calculateEndTime(targetStartTime, h, m);
        }

        if (!pupil_id || !targetInstructorId || !targetBookingDate || !targetStartTime || !computedEndTime) {
            return res.status(400).json({
                success: false,
                message: 'pupil_id, instructor_id, booking_date, start_time, and end_time (or gap duration) are required to convert gap to booking'
            });
        }

        // Check Instructor
        const instructor = await InstructorMaster.findById(targetInstructorId);
        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: 'Instructor not found'
            });
        }

        // Check Pupil
        const pupil = await Pupil.findById(pupil_id).populate('package_id');
        if (!pupil) {
            return res.status(404).json({
                success: false,
                message: 'Pupil not found'
            });
        }

        // Calculate hours
        const credit_use = getTotalHours(targetBookingDate, targetStartTime, computedEndTime);
        if (!credit_use || isNaN(credit_use) || credit_use <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking time range'
            });
        }

        // Check Instructor conflict
        const bookings = await Booking.find({ instructor_id: targetInstructorId });
        const isConflict = bookings.some((b) => {
            const sameDate = b.booking_date.toISOString().slice(0, 10) === targetBookingDate;
            const overlap = targetStartTime < b.end_time && computedEndTime > b.start_time;
            return sameDate && overlap;
        });

        if (isConflict) {
            return res.status(403).json({
                success: false,
                message: 'Instructor is not free at this time'
            });
        }

        // Check Pupil credit hours
        const allBookings = await Booking.find({ pupil_id, school_id });
        const totalPreviousSpent = allBookings.reduce(
            (sum, b) => sum + (b.status !== 'cancelled' ? Number(b.credit_use) || 0 : 0),
            0
        );
        const totalSpent = (totalPreviousSpent || 0) + credit_use;

        if (totalSpent > pupil?.total_credit) {
            return res.status(403).json({
                success: false,
                message: 'Pupil does not have sufficient credit hours'
            });
        }

        let bookingStatus = status || 'booking_request';
        if (String(targetInstructorId) === String(created_by)) {
            bookingStatus = 'booked';
        }

        // Create Booking
        const createdBooking = await Booking.create({
            school_id,
            instructor_id: targetInstructorId,
            pupil_id,
            title,
            booking_date: targetBookingDate,
            start_time: targetStartTime,
            end_time: computedEndTime,
            repeat,
            gearbox,
            pickup,
            dropoff,
            private_notes,
            pupil_summary,
            credit_use,
            status: bookingStatus,
            created_by,
            sell_id
        });

        if (!createdBooking) {
            return res.status(500).json({
                success: false,
                message: 'Booking creation failed'
            });
        }

        // Delete the gap since it's converted
        await Gap.findByIdAndDelete(gapId);

        // Update remaining hours if completed
        if (bookingStatus === 'completed') {
            const remaining = pupil.remaining_hour - credit_use;
            await Pupil.findByIdAndUpdate(
                pupil_id,
                { remaining_hour: remaining },
                { new: true }
            );

            await createCreditLog({
                pupil_id,
                credit_hours: -Number(credit_use),
                reference_id: createdBooking._id,
                reference: 'booking',
                school_id,
                created_by
            });
        }

        // Send notification if created by someone else
        if (String(targetInstructorId) !== String(created_by)) {
            const userToSendNotification = await NotificationToken.findOne({ user: targetInstructorId });
            if (userToSendNotification?.token) {
                let notificationBody = `A new booking request has come to you from gap conversion.`;
                const response = await sendNotification({
                    token: userToSendNotification.token,
                    title: 'New Booking Request',
                    body: notificationBody
                });

                if (response) {
                    await NotificationStore.create({
                        message: notificationBody,
                        receiver_id: targetInstructorId,
                        sender_id: created_by
                    });
                }
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Gap converted to booking successfully',
            data: createdBooking
        });
    } catch (error) {
        console.error('Convert Gap to Booking Error:', error);
        next(error);
    }
};
