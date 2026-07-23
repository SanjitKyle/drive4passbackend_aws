const CourseForm = require('../../models/DS/course_form.model');
const NotificationToken = require("../../models/DS/fcmtokenstore");
const InstructorMaster = require('../../models/DS/instructor_master.model');
const NotificationStore = require('../../models/DS/notification_stored');
const { sendNotification } = require('./message_token_store');
const MailSend = require('../../utils/MailSend');
const CourseFormEmailLog = require('../../models/DS/course_form_email_log.model');

exports.createCourseForm = async (req, res) => {
    try {
        const { name, email, phone, course_interested, previous_lessons, transmission, postcode, additional_message } = req.body;
        
        const formData = {
            name, email, phone, course_interested, previous_lessons, transmission, postcode, additional_message
        };

        // Remove undefined or empty string fields to avoid enum validation errors
        Object.keys(formData).forEach(key => {
            if (formData[key] === undefined || formData[key] === '') {
                delete formData[key];
            }
        });

        const newForm = new CourseForm(formData);

        await newForm.save();

        res.status(200).json({
            status: true,
            message: 'Course form submitted successfully',
            data: newForm
        });
    } catch (error) {
        console.error('Error in createCourseForm:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.getAllCourseForms = async (req, res) => {
    try {
        const forms = await CourseForm.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            data: forms
        });
    } catch (error) {
        console.error('Error in getAllCourseForms:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.getCourseFormById = async (req, res) => {
    try {
        const { id } = req.params;
        const form = await CourseForm.findById(id);
        if (!form) {
            return res.status(404).json({ status: false, message: 'Course form not found' });
        }
        res.status(200).json({ status: true, data: form });
    } catch (error) {
        console.error('Error in getCourseFormById:', error);
        res.status(500).json({ status: false, message: 'Internal Server Error', error: error.message });
    }
};

exports.updateCourseForm = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, course_interested, previous_lessons, transmission, postcode, additional_message } = req.body;
        
        const formData = {
            name, email, phone, course_interested, previous_lessons, transmission, postcode, additional_message
        };

        Object.keys(formData).forEach(key => {
            if (formData[key] === undefined || formData[key] === '') {
                delete formData[key];
            }
        });

        const updatedForm = await CourseForm.findByIdAndUpdate(id, formData, { new: true });

        if (!updatedForm) {
            return res.status(404).json({ status: false, message: 'Course form not found' });
        }

        res.status(200).json({
            status: true,
            message: 'Course form updated successfully',
            data: updatedForm
        });
    } catch (error) {
        console.error('Error in updateCourseForm:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.deleteCourseForm = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedForm = await CourseForm.findByIdAndDelete(id);

        if (!deletedForm) {
            return res.status(404).json({ status: false, message: 'Course form not found' });
        }

        res.status(200).json({
            status: true,
            message: 'Course form deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteCourseForm:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const id = req.user ? req.user._id : null;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        const form = await CourseForm.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Course form not found"
            });
        }

        if (id && id.toString() !== "694a2d3c5f403a5f000eaa51") {
            const userToSendNotification = await NotificationToken.findOne({ user: "694a2d3c5f403a5f000eaa51" });
            const getInstructorProfile = await InstructorMaster.findById(id);
            if (userToSendNotification?.token && getInstructorProfile) {
                const responsetogetnotifaction = await sendNotification({
                    token: userToSendNotification.token,
                    title: "Intensive Course Enquiry Updated",
                    body: `${getInstructorProfile.name} has updated the status of an intensive course enquiry to ${status}.`,
                    data: { url: `https://admin.drive4pass.co.uk/course-enquiries/${req.params.id}` }
                });
                
                if (responsetogetnotifaction) {
                    await NotificationStore.create({
                        message: `${getInstructorProfile.name} has updated the status of an intensive course enquiry to ${status}.`,
                        receiver_id: "694a2d3c5f403a5f000eaa51",
                        sender_id: id,
                        redirect_url: `https://admin.drive4pass.co.uk/course-enquiries/${req.params.id}`
                    });
                }
            }
        }

        res.status(200).json({
            success: true,
            message: "Status updated",
            data: form
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating status",
            error: error.message
        });
    }
};

exports.assignInstructor = async (req, res) => {
    try {
        const { instructor_id } = req.body;
        const senderId = req.user ? req.user._id : null;

        if (!instructor_id) {
            return res.status(400).json({
                message: "Instructor ID is required",
                success: false,
            });
        }

        const updated = await CourseForm.findByIdAndUpdate(
            req.params.id,
            { instructor: instructor_id },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                message: "Course form not found",
                success: false,
            });
        }

        const userToSendNotification = await NotificationToken.findOne({ user: instructor_id });
        if (userToSendNotification?.token) {
            let notificationBody = `A new intensive course enquiry has been assigned to you and status is ${updated.status}.`;
            const responsetogetnotifaction = await sendNotification({
                token: userToSendNotification.token,
                title: "Pupil Assigned",
                body: notificationBody,
                data: { route: "/course-enquiries" }
            });
            if (responsetogetnotifaction?.success || responsetogetnotifaction) {
                await NotificationStore.create({
                    message: notificationBody,
                    receiver_id: instructor_id,
                    sender_id: senderId,
                    route: "/course-enquiries"
                });
            }
        }

        return res.status(200).json({
            message: "Instructor assigned successfully",
            success: true,
            data: updated,
        });

    } catch (error) {
        console.error("Assign Instructor Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        });
    }
};

exports.sendResourcePack = async (req, res, next) => {
  try {
    const { course_form_id } = req.body;
    const senderId = req.user ? req.user._id : null;

    if (!course_form_id) {
      return res.status(400).json({ success: false, message: "course_form_id is required." });
    }

    const form = await CourseForm.findById(course_form_id);
    if (!form) {
      return res.status(404).json({ success: false, message: "Course form not found." });
    }

    if (!form.email) {
      return res.status(400).json({ success: false, message: "Course form does not have an email address." });
    }

    const businessName = "Drive4Pass";

    await MailSend.SendResourcePackMail(businessName, form.email, form.name);

    await CourseFormEmailLog.create({
      course_form_id: form._id,
      email_type: 'resource_pack',
      sent_by: senderId,
      status: 'success'
    });

    res.status(200).json({ success: true, message: `Resource pack email sent successfully to ${form.email}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error sending resource pack", error: err.message });
  }
};

exports.sendReviewLink = async (req, res, next) => {
  try {
    const { course_form_id, review_link } = req.body;
    const senderId = req.user ? req.user._id : null;

    if (!course_form_id || !review_link) {
      return res.status(400).json({ success: false, message: "course_form_id and review_link are required." });
    }

    const form = await CourseForm.findById(course_form_id);
    if (!form) {
      return res.status(404).json({ success: false, message: "Course form not found." });
    }

    if (!form.email) {
      return res.status(400).json({ success: false, message: "Course form does not have an email address." });
    }

    const businessName = "Drive4Pass";

    await MailSend.SendReviewLinkMail(businessName, form.email, form.name, review_link);

    await CourseFormEmailLog.create({
      course_form_id: form._id,
      email_type: 'review_link',
      sent_by: senderId,
      status: 'success'
    });

    res.status(200).json({ success: true, message: `Review link email sent successfully to ${form.email}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error sending review link", error: err.message });
  }
};

exports.sendWelcomeMessage = async (req, res, next) => {
  try {
    const { course_form_id } = req.body;
    const senderId = req.user ? req.user._id : null;

    if (!course_form_id) {
      return res.status(400).json({ success: false, message: "course_form_id is required." });
    }

    const form = await CourseForm.findById(course_form_id);
    if (!form) {
      return res.status(404).json({ success: false, message: "Course form not found." });
    }

    if (!form.email) {
      return res.status(400).json({ success: false, message: "Course form does not have an email address." });
    }

    const businessName = "Drive4Pass";

    await MailSend.SendWelcomeMessageMail(businessName, form.email, form.name);

    await CourseFormEmailLog.create({
      course_form_id: form._id,
      email_type: 'welcome_message',
      sent_by: senderId,
      status: 'success'
    });

    res.status(200).json({ success: true, message: `Welcome message email sent successfully to ${form.email}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error sending welcome message", error: err.message });
  }
};

exports.getEmailLogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const logs = await CourseFormEmailLog.find({ course_form_id: id }).sort({ createdAt: -1 }).populate('sent_by', 'name email');
    
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching email logs", error: err.message });
  }
};
