require('dotenv').config();
const nodemailer = require("nodemailer");

async function testEmail() {
  console.log("Using email:", process.env.EMAIL);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Test Team" <${process.env.EMAIL}>`,
      to: "sanjitpal132@gmail.com",
      subject: "Test Email from Backend",
      text: "This is a test email to verify Nodemailer is working.",
    });
    console.log("Email sent successfully! Message ID:", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

testEmail();
