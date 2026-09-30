const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
   pupil_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"pupil"
   },
   instructor_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"InstructorMaster"
   },
    last_message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
      default: null,
    },
    // Optional unread message counter or status
    unread_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("conversation", conversationSchema);