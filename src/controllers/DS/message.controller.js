const Message = require("../../models/DS/message.model");
const Conversation = require("../../models/DS/conversion.model");
const mongoose = require("mongoose");

/**
 * Helper to get current user ID
 */
const getAuthUserId = (req) => {
  return req.user?._id || req.user?.userId || req.user?.id || null;
};

/**
 * Helper to determine sender_type from req.user
 */
const getSenderType = (req) => {
  if (req.body.sender_type) return req.body.sender_type;
  if (req.user?.role === "pupil") return "pupil";
  if (req.user?.role === "instructor") return "InstructorMaster";
  return req.body.sender_type || "pupil";
};

/**
 * 1. Send a Message
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversation_id, text } = req.body;
    const senderId = getAuthUserId(req);
    const senderType = getSenderType(req);

    if (!conversation_id || !text) {
      return res.status(400).json({
        success: false,
        message: "conversation_id and text are required",
      });
    }

    if (!senderId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Verify conversation exists
    const conversation = await Conversation.findById(conversation_id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // 1. Create message
    const message = await Message.create({
      conversation: conversation_id,
      sender: senderId,
      sender_type: senderType,
      text,
    });

    // 2. Update last_message in conversation
    conversation.last_message = message._id;
    await conversation.save();

    // 3. Populate sender before returning
    const populatedMessage = await Message.findById(message._id).populate("sender");

    // 4. Real-time Socket.IO broadcast
    const io = req.app.get("io");
    if (io) {
      io.to(conversation_id).emit("receive_message", populatedMessage);
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. Get Messages for a Conversation
 */
exports.getMessagesByConversation = async (req, res, next) => {
  try {
    const { conversation_id } = req.params;
    const userId = getAuthUserId(req);

    if (!mongoose.Types.ObjectId.isValid(conversation_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const filter = {
      conversation: conversation_id,
    };

    if (userId) {
      filter.deletedBy = { $ne: userId };
    }

    const messages = await Message.find(filter)
      .populate("sender")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Mark Conversation Messages as Read
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const { conversation_id } = req.params;
    const userId = getAuthUserId(req);

    if (!conversation_id) {
      return res.status(400).json({
        success: false,
        message: "conversation_id is required",
      });
    }

    const filter = {
      conversation: conversation_id,
      isRead: false,
    };

    // Only mark messages sent by the OTHER participant as read
    if (userId) {
      filter.sender = { $ne: userId };
    }

    await Message.updateMany(filter, { $set: { isRead: true } });

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. Delete Message for Me (Self delete)
 */
exports.deleteMessageForMe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getAuthUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const message = await Message.findByIdAndUpdate(
      id,
      { $addToSet: { deletedBy: userId } },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted for you",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Delete Message for Everyone
 */
exports.deleteMessageForEveryone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = getAuthUserId(req);

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Check if the requester is the sender
    if (userId && String(message.sender) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages for everyone",
      });
    }

    message.isDeletedForEveryone = true;
    message.text = "This message was deleted";
    await message.save();

    const io = req.app.get("io");
    if (io) {
      io.to(message.conversation.toString()).emit("message_deleted", {
        conversation_id: message.conversation,
        message_id: message._id,
        isDeletedForEveryone: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted for everyone",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
