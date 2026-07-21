const mongoose = require("mongoose");

const notificationTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ["web", "android", "ios"],
      default: "web",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "NotificationToken",
  notificationTokenSchema
);