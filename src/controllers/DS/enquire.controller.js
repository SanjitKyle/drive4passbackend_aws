const enquiresModel = require("../../models/DS/enquires.model");
const Enquire = require("../../models/DS/enquires.model");
const NotificationToken = require("../../models/DS/fcmtokenstore");
const InstructorMaster = require('../../models/DS/instructor_master.model');
const NotificationStore = require('../../models/DS/notification_stored');
const { sendNotification } = require('./message_token_store');
const MailSend = require('../../utils/MailSend');
const EnquiryEmailLog = require('../../models/DS/enquiry_email_log.model');
exports.createEnquiry = async (req, res) => {
  try {
    const payload = req.body.form_fields || req.body;
    
    const {
      name,
      email,
      phone,
      postcode,
      driving_experience,
      type_of_training,
      licence,
      source,
      lesson_preference_time,
      preferred_start_date,
      preferred_contact_method,
      additional_message
    } = payload;

  
    
console.log('Webhook received');     
console.log(req.body);

    const enquiry = await Enquire.create({
      name,
      email,
      phone,
      postcode,
      driving_experience,
      type_of_training,
      licence,
      lesson_preference_time,
      preferred_start_date,
      preferred_contact_method,
      source,
      additional_message,
    });
    res.status(200).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
// ✅ Get all enquiries
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquire.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching enquiries",
      error: error.message
    });
  }
};
// ✅ Get single enquiry
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquire.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching enquiry",
      error: error.message
    });
  }
};
// ✅ Update enquiry status
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { status, package, postcode } = req.body;
    const id = req.user._id;

    const enquiry = await Enquire.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }
    const getInstructorProfile = await InstructorMaster.findById(enquiry.instructor);
    console.log('getInstructorProfile', getInstructorProfile)
    const userToSendNotification = await NotificationToken.findOne({ user: "694a2d3c5f403a5f000eaa51" });

    if (id !== "694a2d3c5f403a5f000eaa51") {
      if (userToSendNotification?.token) {
        const responsetogetnotifaction = await sendNotification({
          token: userToSendNotification?.token,
          title: "Enquiry Updated",
          body: `${getInstructorProfile?.name} has updated the status of an enquiry to ${status}.`,
          data: {
            url: `https://admin.drive4pass.co.uk/enquiries/${req.params.id}`
          }
        });
        if (responsetogetnotifaction) {
          const storingToDb = await NotificationStore.create({
            message: `${getInstructorProfile?.name} has updated the status of an enquiry to ${status}.`,
            receiver_id: "694a2d3c5f403a5f000eaa51",
            sender_id: id,
            redirect_url: `https://admin.drive4pass.co.uk/enquiries/${req.params.id}`
          })
          console.log('storingToDb', storingToDb)
        }
      }
    }



    res.status(200).json({
      success: true,
      message: "Status updated",
      data: enquiry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating status",
      error: error.message
    });
  }
};
// ✅ Delete enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquire.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting enquiry",
      error: error.message
    });
  }
};
// enquiry status
exports.updateStatus = async (req, res) => {
  try {
    const { enquiry_status } = req.body;
    const senderId = req.user ? req.user._id : null;

    if (!enquiry_status) {
      return res.status(400).json({
        success: false,
        message: "enquiry_status is required"
      });
    }

    const enquiry = await Enquire.findByIdAndUpdate(req.params.id, { enquiry_status }, { new: true, runValidators: true });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    if (enquiry_status === 'confirmed' && enquiry.instructor) {
      const userToSendNotification = await NotificationToken.findOne({ user: enquiry.instructor });
      if (userToSendNotification?.token) {
        const responsetogetnotifaction = await sendNotification({
          token: userToSendNotification.token,
          title: "Enquiry Confirmed",
          body: `New enquiry ${enquiry.name} has been assigned to you and status is confirmed.`,
          data: { route: "/enquiries" }
        });
        
        if (responsetogetnotifaction) {
          await NotificationStore.create({
            message: `New enquiry ${enquiry.name} has been assigned to you and status is confirmed.`,
            receiver_id: enquiry.instructor,
            sender_id: senderId,
            route: "/enquiries"
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Enquiry status updated",
      data: enquiry
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating enquiry status",
      error: error.message
    });
  }
}
// assign instructor
exports.assignInstructor = async (req, res) => {
  try {
    const { instructor_id } = req.body;
    const senderId = req.user._id;

    if (!instructor_id) {
      return res.status(400).json({
        message: "Instructor ID is required",
        success: false,
      });
    }

    const updated = await Enquire.findByIdAndUpdate(
      req.params.id,
      { instructor: instructor_id },
      { new: true }
    );

    const enquiry = await Enquire.findById({ _id: req.params.id })
    if (!updated) {
      return res.status(404).json({
        message: "Enquiry not found",
        success: false,
      });
    }
    const userToSendNotification = await NotificationToken.findOne({ user: instructor_id });
    let responsetogetnotifaction;
    if (userToSendNotification?.token) {
      let notificationBody = `A new enquiry has been assigned to you and status of enquiry is ${enquiry.status}.`;
      if (enquiry.enquiry_status === 'confirmed') {
        notificationBody = `A new enquiry has been assigned to you and status is confirmed.`;
      }

      responsetogetnotifaction = await sendNotification({
        token: userToSendNotification?.token,
        title: "Pupil Assigned",
        body: notificationBody,
        data: { route: "/enquiries" }
      });
      if (responsetogetnotifaction?.success || responsetogetnotifaction) {
        const storingToDb = await NotificationStore.create({
          message: notificationBody,
          receiver_id: instructor_id,
          sender_id: senderId,
          route: "/enquiries"
        })

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
// get enquire by instructor 
exports.getEnquiryByInstructor = async (req, res) => {
  try {
    const enquiries = await Enquire.find({
      instructor: req.params.id
    });

    if (enquiries.length === 0) {
      return res.status(404).json({
        message: "No enquiries found for this instructor",
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      enquiries
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
};
// seen all enquiries 
exports.SeenEnquiry = async (req, res) => {
  try {
   
    const updating=await enquiresModel.findByIdAndUpdate(req.params.id,{seen:true},{new:true})

    if(!updating)
    {
      return res.status(403).json({
        message:"Could not update seen",
        success:false
      })
    }
    return res.status(200).json({
      message: "Successfully marked as seen",
      success: true,
      enquiry:updating
    });

  } catch (error) {
    console.log("error", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};
// edit enquiry
exports.editEnquiry = async (req, res) => {
  try {
    const updatedEnquiry = await Enquire.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedEnquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      data: updatedEnquiry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating enquiry",
      error: error.message
    });
  }
};

exports.sendResourcePack = async (req, res, next) => {
  try {
    const { enquiry_id } = req.body;
    const senderId = req.user ? req.user._id : null;

    if (!enquiry_id) {
      return res.status(400).json({ success: false, message: "enquiry_id is required." });
    }

    const enquiry = await Enquire.findById(enquiry_id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found." });
    }

    if (!enquiry.email) {
      return res.status(400).json({ success: false, message: "Enquiry does not have an email address." });
    }

    const businessName = "Drive4Pass";

    await MailSend.SendResourcePackMail(businessName, enquiry.email, enquiry.name);

    await EnquiryEmailLog.create({
      enquiry_id: enquiry._id,
      email_type: 'resource_pack',
      sent_by: senderId,
      status: 'success'
    });

    res.status(200).json({ success: true, message: `Resource pack email sent successfully to ${enquiry.email}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error sending resource pack", error: err.message });
  }
};

exports.sendReviewLink = async (req, res, next) => {
  try {
    const { enquiry_id, review_link } = req.body;
    const senderId = req.user ? req.user._id : null;

    if (!enquiry_id || !review_link) {
      return res.status(400).json({ success: false, message: "enquiry_id and review_link are required." });
    }

    const enquiry = await Enquire.findById(enquiry_id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found." });
    }

    if (!enquiry.email) {
      return res.status(400).json({ success: false, message: "Enquiry does not have an email address." });
    }

    const businessName = "Drive4Pass";

    await MailSend.SendReviewLinkMail(businessName, enquiry.email, enquiry.name, review_link);

    await EnquiryEmailLog.create({
      enquiry_id: enquiry._id,
      email_type: 'review_link',
      sent_by: senderId,
      status: 'success'
    });

    res.status(200).json({ success: true, message: `Review link email sent successfully to ${enquiry.email}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error sending review link", error: err.message });
  }
};

exports.sendWelcomeMessage = async (req, res, next) => {
  try {
    const { enquiry_id } = req.body;
    const senderId = req.user ? req.user._id : null;

    if (!enquiry_id) {
      return res.status(400).json({ success: false, message: "enquiry_id is required." });
    }

    const enquiry = await Enquire.findById(enquiry_id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found." });
    }

    if (!enquiry.email) {
      return res.status(400).json({ success: false, message: "Enquiry does not have an email address." });
    }

    const businessName = "Drive4Pass";

    await MailSend.SendWelcomeMessageMail(businessName, enquiry.email, enquiry.name);

    await EnquiryEmailLog.create({
      enquiry_id: enquiry._id,
      email_type: 'welcome_message',
      sent_by: senderId,
      status: 'success'
    });

    res.status(200).json({ success: true, message: `Welcome message email sent successfully to ${enquiry.email}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error sending welcome message", error: err.message });
  }
};

exports.getEmailLogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const logs = await EnquiryEmailLog.find({ enquiry_id: id }).sort({ createdAt: -1 }).populate('sent_by', 'name email');
    
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching email logs", error: err.message });
  }
};
