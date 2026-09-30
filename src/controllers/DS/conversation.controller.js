const Conversation = require("../../models/DS/conversion.model");
const mongoose = require("mongoose");

/**
 * Helper to get current user ID
 */
const getAuthUserId = (req) => {
  return req.user?._id || req.user?.userId || req.user?.id || null;
};

/**
 * 1. Create or Get Existing Conversation
 */
exports.getOrCreateConversation = async (req, res, next) => {
  try {
    const { pupil_id, instructor_id } = req.body;

    if (!pupil_id || !instructor_id) {
      return res.status(400).json({
        success: false,
        message: "pupil_id and instructor_id are required",
      });
    }

    let conversation = await Conversation.findOne({
      pupil_id,
      instructor_id,
    })
      .populate("pupil_id", "full_name email phone")
      .populate("instructor_id", "name email mobile")
      .populate("last_message");

    if (!conversation) {
      conversation = await Conversation.create({
        pupil_id,
        instructor_id,
      });

      conversation = await Conversation.findById(conversation._id)
        .populate("pupil_id", "full_name email phone")
        .populate("instructor_id", "name email mobile");
    }

    return res.status(200).json({
      success: true,
      message: "Conversation fetched successfully",
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. Get All Conversations for the Logged-In User
 */
exports.getMyConversations = async (req, res, next) => {
  try {
    const userId = getAuthUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const conversations = await Conversation.find({
      $or: [{ pupil_id: userId }, { instructor_id: userId }],
    })
      .populate("pupil_id", "full_name email phone")
      .populate("instructor_id", "name email mobile")
      .populate("last_message")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Get Single Conversation by ID
 */
exports.getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const conversation = await Conversation.findById(id)
      .populate("pupil_id", "full_name email phone")
      .populate("instructor_id", "name email mobile")
      .populate("last_message");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};
