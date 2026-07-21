const nodemailer = require("nodemailer");

exports.SingUpMail = async (businessName, email, password, name) => {
  console.log("business:", businessName);

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
      from: `"${businessName} Team" <${process.env.EMAIL}>`,
      to: email,
      subject: `Thank You for Signing Up as an Instructor with ${businessName}🚗`,
      text: `
Hello ${name},

Thank you for signing up as an instructor with ${businessName}.

Your instructor account has been created successfully. Below are your login details:

Email:${email}
Temporary Password: ${password}

For security reasons, we strongly recommend changing your password immediately after your first login.

Our team is currently reviewing your profile. Once verification is complete, we’ll contact you with the next steps.

Thank you for choosing to work with ${businessName}.
We look forward to working with you.

Warm regards,
${businessName} Team
            `,
      html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family:Arial, Helvetica, sans-serif; background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px 15px;">
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff; border-radius:8px; padding:30px;">

            <tr>
              <td style="text-align:center;">
                <h2 style="color:#1f2937;">Welcome to ${businessName} 🚗</h2>
                <p style="color:#6b7280; font-size:14px;">
                  Your Instructor Account Has Been Created
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px; color:#374151; font-size:15px; line-height:1.6;">
                <p>Hello <strong>${name}</strong>,</p>

                <p>
                  Thank you for signing up as an instructor with
                  <strong>${businessName}</strong>. We’re happy to inform you that
                  your instructor account has been created successfully.
                </p>

                <p><strong>Your Login Details:</strong></p>

              <table cellpadding="0" cellspacing="0"
  style="background:#f9fafb; border-radius:6px; margin-bottom:15px; width:100%;">
  <tr>
    <td style="padding:6px 10px; font-size:14px; line-height:1.4;">
      <strong>Email:</strong> ${email}
    </td>
  </tr>
  <tr>
    <td style="padding:6px 10px; font-size:14px; line-height:1.4;">
      <strong>Temporary Password:</strong> ${password}
    </td>
  </tr>
</table>


                <p style="color:#b91c1c; font-size:14px;">
                  ⚠ For security reasons, please change your password immediately
                  after logging in for the first time.
                </p>

                <p>
                  Our team is currently reviewing your profile. Once the verification
                  process is complete, we’ll reach out to you with the next steps.
                </p>

                <p style="margin-top:25px;">
                  We appreciate your interest in working with us and look forward to
                  collaborating with you.
                </p>

                <p style="margin-top:30px;">
                  Warm regards,<br/>
                  <strong>${businessName} Team</strong>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
            `,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
}





exports.InstructorConfirmMail = async (businessName, email, password, name) => {
  console.log("business:", businessName);

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
      from: `"${businessName} Team" <${process.env.EMAIL}>`,
      to: email,
      subject: `Congratulations! You’re Approved as an Instructor with ${businessName} 🚗`,

      // ✅ TEXT VERSION
      text: `
Hello ${name},

Congratulations! 🎉

We’re pleased to inform you that your profile has been successfully reviewed and you are now APPROVED as an instructor with ${businessName}.

Your instructor account is active. You can log in using the details below:

Email: ${email}
Temporary Password: ${password}

For security reasons, please change your password immediately after your first login.

You can now start accepting students and managing your instructor profile.

If you need any assistance, our support team is always here to help.

Welcome aboard!
We look forward to working with you.

Warm regards,
${businessName} Team
            `,

      // ✅ HTML VERSION
      html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family:Arial, Helvetica, sans-serif; background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px 15px;">
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff; border-radius:8px; padding:30px;">

            <tr>
              <td style="text-align:center;">
                <h2 style="color:#1f2937;">🎉 You’re Approved!</h2>
                <p style="color:#6b7280; font-size:14px;">
                  Welcome to ${businessName} as an Instructor 🚗
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px; color:#374151; font-size:15px; line-height:1.6;">
                <p>Hello <strong>${name}</strong>,</p>

                <p>
                  We’re happy to inform you that your instructor profile has been
                  <strong>successfully reviewed and approved</strong>.
                </p>

                <p>
                  Your instructor account is now active. You can log in using
                  the credentials below:
                </p>

                <p><strong>Your Login Details:</strong></p>

                <table cellpadding="0" cellspacing="0"
                  style="background:#f9fafb; border-radius:6px; margin-bottom:15px; width:100%;">
                  <tr>
                    <td style="padding:8px 12px; font-size:14px;">
                      <strong>Email:</strong> ${email}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px; font-size:14px;">
                      <strong>Temporary Password:</strong> ${password}
                    </td>
                  </tr>
                </table>

                <p style="color:#b91c1c; font-size:14px;">
                  ⚠ For security reasons, please change your password immediately
                  after your first login.
                </p>

                <p>
                  You can now begin accepting students, managing your schedule,
                  and delivering lessons through ${businessName}.
                </p>

                <p style="margin-top:25px;">
                  If you have any questions, feel free to contact our support team.
                </p>

                <p style="margin-top:30px;">
                  Welcome aboard!<br/>
                  <strong>${businessName} Team</strong>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
            `,
    });

    console.log("Instructor approval email sent:", info.messageId);
    return info;

  } catch (error) {
    console.error("Instructor approval email error:", error);
    throw error;
  }
};
