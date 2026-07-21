
const admin = require("../config/firebasadmin");

const sendNotification = async (
  token,
  title,
  body,
  data = {}
) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      token,
    };

    const response = await admin.messaging().send(message);

    console.log("Notification sent:", response);

    return response;
  } catch (error) {
    console.error("Notification Error:", error);
    throw error;
  }
};

module.exports = {
  sendNotification,
};