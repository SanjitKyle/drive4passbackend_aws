const NotificationToken = require("../../models/DS/fcmtokenstore");
const admin = require("../../config/firebasadmin");

exports.saveToken = async (req, res) => {
  try {
    const { token, platform, id } = req.body;

    const response = await NotificationToken.findOneAndUpdate(
      {
        user: id,
      },
      {
        token,
        platform,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.sendNotification = async ({
  token,
  title,
  body,
  data
}) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      token,
      data
    };

    return await admin.messaging().send(message);
  } catch (error) {
    console.error("FCM Error:", error);
    throw error;
  }
};

