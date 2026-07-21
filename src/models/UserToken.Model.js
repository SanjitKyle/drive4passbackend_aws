const mongoose = require("mongoose");
const UsetToken = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  loginAt: {
    type: Date,
    required: true,
  },
  logoutAt: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  expireAt: {
    type: Date,
  },
});

const userToken = mongoose.model("userToken", UsetToken);

module.exports = userToken;
