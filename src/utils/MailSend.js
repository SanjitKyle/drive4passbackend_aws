const nodemailer = require("nodemailer");
const path = require("path");

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
      from: `"Drive4pass Team" <${process.env.EMAIL}>`,
      to: email,
      subject: `Thank You for Signing Up as an Instructor with Drive4pass`,
      text: `
Hello ${name},

Thank you for signing up as an instructor with Drive4pass. 

Your instructor account has been created successfully. Below are your login details:

Email:${email}


Our team is currently reviewing your profile. Once verification is complete, we’ll contact you with the next steps.

Thank you for choosing to work with Drive4pass.
We look forward to working with you.

Warm regards,
Drive4pass Team
            `,
      html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family:Arial, Helvetica, sans-serif; background-color:#2a2a2a;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 15px;">
          <!-- Logo -->
          <div style="margin-bottom:20px; text-align:center;">
             <h1 style="color:#dc2626; margin:0; font-size:28px; letter-spacing:1px; font-weight:bold; font-style:italic;">DRIVE<span style="color:#16a34a;">4</span>PASS</h1>
          </div>
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; padding:0; border-radius:0;">
            <tr>
              <td style="padding:40px 30px;">
                <h2 style="color:#1f2937; margin-top:0; font-size:22px;">Welcome to Drive4pass 🚗</h2>
                <p style="color:#374151; font-size:15px; margin-bottom:20px;">Hi <strong>${name}</strong>,</p>
                <p style="color:#374151; font-size:15px; line-height:1.6; margin-bottom:25px;">
                  Thank you for signing up as an instructor with <strong style="color:#dc2626;">DRIVE <span style="color:#16a34a;">4</span> PASS</strong>. We're happy to inform you that your instructor account has been created successfully.
                </p>

                <!-- Login Details Card -->
                <div style="border-left:4px solid #16a34a; background-color:#f0fdf4; padding:20px; margin-bottom:20px;">
                  <p style="margin:0 0 10px 0; font-weight:bold; color:#1f2937; font-size:15px;">Your Login Details</p>
                  <table cellpadding="0" cellspacing="0" style="width:100%;">
                    <tr>
                      <td style="padding:4px 0; color:#374151; font-size:14px;"><strong>Email:</strong></td>
                      <td style="padding:4px 0; color:#374151; font-size:14px;">${email}</td>
                    </tr>
                    <tr>
                      <td style="padding:4px 0; color:#374151; font-size:14px;"><strong>Once you are Approved You will get </strong></td>
                      <td style="padding:4px 0; color:#374151; font-size:14px;">${password}</td>
                    </tr>
                  </table>
                </div>

                <!-- Security Alert -->
                <div style="border-left:4px solid #dc2626; background-color:#fef2f2; padding:20px; margin-bottom:20px;">
                  <p style="margin:0; color:#b91c1c; font-size:14px; line-height:1.5;">
                    <strong>⚠ Important Security Notice:</strong><br/>
                    Please change your password immediately after logging in for the first time.
                  </p>
                </div>

                <!-- Next Steps Card -->
                <div style="border-left:4px solid #eab308; background-color:#fefce8; padding:20px; margin-bottom:30px;">
                  <p style="margin:0 0 10px 0; font-weight:bold; color:#1f2937; font-size:15px;">What's next?</p>
                  <p style="margin:0; color:#374151; font-size:14px; line-height:1.5;">
                    Our team is currently reviewing your profile. Once the verification process is complete, we'll reach out to you with the next steps.
                  </p>
                </div>
                
                <p style="color:#374151; font-size:15px; margin:0; line-height:1.6;">
                  Warm regards,<br/>
                  <strong>Drive4pass Team</strong><br/>
                  <span style="font-size:13px; color:#6b7280;">Tel: 0333 335 7000 | Web: <a href="http://www.drive4pass.co.uk" style="color:#dc2626; text-decoration:none;">www.drive4pass.co.uk</a></span>
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color:#dc2626; padding:30px; text-align:center;">
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:14px; font-weight:bold;">📞 0333 335 7000</p>
                <p style="color:#ffffff; margin:0 0 20px 0; font-size:14px; font-weight:bold;">💬 0739 912 1111</p>
                
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:11px; opacity:0.9;">Authorised & regulated by the DVSA</p>
                <p style="color:#ffffff; margin:0 0 20px 0; font-size:11px; opacity:0.9;">Co no 15780539</p>
                
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:10px; opacity:0.8;">All rights reserved Drive4pass</p>
                <p style="color:#ffffff; margin:0; font-size:10px; opacity:0.8;">This is an automated email. Please do not reply to this email.</p>
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
      from: `"Drive4pass  Team" <${process.env.EMAIL}>`,
      to: email,
      subject: `Congratulations! You’re Approved as an Instructor with Drive4pass 🚗`,

      // ✅ TEXT VERSION
      text: `
Hello ${name},

Congratulations! 🎉

We’re pleased to inform you that your profile has been successfully reviewed and you are now APPROVED as an instructor with Drive4pass.

Your instructor account is active. You can log in using the details below:

Email: ${email}
Temporary Password: ${password}

For security reasons, please change your password immediately after your first login.

You can now start accepting students and managing your instructor profile.

If you need any assistance, our support team is always here to help.

Welcome aboard!
We look forward to working with you.

Warm regards,
Drive4pass Team
            `,

      // ✅ HTML VERSION
      html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family:Arial, Helvetica, sans-serif; background-color:#2a2a2a;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 15px;">
          <!-- Logo -->
          <div style="margin-bottom:20px; text-align:center;">
             <h1 style="color:#dc2626; margin:0; font-size:28px; letter-spacing:1px; font-weight:bold; font-style:italic;">DRIVE<span style="color:#16a34a;">4</span>PASS</h1>
          </div>
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; padding:0; border-radius:0;">
            <tr>
              <td style="padding:40px 30px;">
                <h2 style="color:#1f2937; margin-top:0; font-size:22px;">🎉 You're Approved!</h2>
                <p style="color:#374151; font-size:15px; margin-bottom:20px;">Hi <strong>${name}</strong>,</p>
                <p style="color:#374151; font-size:15px; line-height:1.6; margin-bottom:25px;">
                  Welcome to <strong style="color:#dc2626;">DRIVE <span style="color:#16a34a;">4</span> PASS</strong> as an Instructor. We're happy to inform you that your instructor profile has been <strong>successfully reviewed and approved</strong>.
                </p>

                <!-- Login Details Card -->
                <div style="border-left:4px solid #16a34a; background-color:#f0fdf4; padding:20px; margin-bottom:20px;">
                  <p style="margin:0 0 10px 0; font-weight:bold; color:#1f2937; font-size:15px;">Your Login Details</p>
                  <table cellpadding="0" cellspacing="0" style="width:100%;">
                    <tr>
                      <td style="padding:4px 0; color:#374151; font-size:14px;"><strong>Email:</strong></td>
                      <td style="padding:4px 0; color:#374151; font-size:14px;">${email}</td>
                    </tr>
                    <tr>
                      <td style="padding:4px 0; color:#374151; font-size:14px;"><strong>Temporary Password:</strong></td>
                      <td style="padding:4px 0; color:#374151; font-size:14px;">${password}</td>
                    </tr>
                  </table>
                </div>

                <!-- Security Alert -->
                <div style="border-left:4px solid #dc2626; background-color:#fef2f2; padding:20px; margin-bottom:20px;">
                  <p style="margin:0; color:#b91c1c; font-size:14px; line-height:1.5;">
                    <strong>⚠ Important Security Notice:</strong><br/>
                    Please change your password immediately after your first login.
                  </p>
                </div>

                <!-- Next Steps Card -->
                <div style="border-left:4px solid #eab308; background-color:#fefce8; padding:20px; margin-bottom:30px;">
                  <p style="margin:0 0 10px 0; font-weight:bold; color:#1f2937; font-size:15px;">What's next?</p>
                  <p style="margin:0; color:#374151; font-size:14px; line-height:1.5;">
                    Your instructor account is now active. You can now begin accepting students, managing your schedule, and delivering lessons through Drive4pass.
                  </p>
                </div>

                <p style="color:#374151; font-size:15px; margin-bottom:20px;">If you have any questions, feel free to contact our support team.</p>
                
                <p style="color:#374151; font-size:15px; margin:0; line-height:1.6;">
                  Welcome aboard!<br/>
                  <strong>Drive4pass Team</strong><br/>
                  <span style="font-size:13px; color:#6b7280;">Tel: 0333 335 7000 | Web: <a href="http://www.drive4pass.co.uk" style="color:#dc2626; text-decoration:none;">www.drive4pass.co.uk</a></span>
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color:#dc2626; padding:30px; text-align:center;">
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:14px; font-weight:bold;">📞 0333 335 7000</p>
                <p style="color:#ffffff; margin:0 0 20px 0; font-size:14px; font-weight:bold;">💬 0739 912 1111</p>
                
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:11px; opacity:0.9;">Authorised & regulated by the DVSA</p>
                <p style="color:#ffffff; margin:0 0 20px 0; font-size:11px; opacity:0.9;">Co no 15780539</p>
                
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:10px; opacity:0.8;">All rights reserved Drive4pass</p>
                <p style="color:#ffffff; margin:0; font-size:10px; opacity:0.8;">This is an automated email. Please do not reply to this email.</p>
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
exports.SendResourcePackMail = async (businessName, email, name) => {
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
      from: `"Drive4pass Team" <${process.env.EMAIL}>`,
      to: email,
      subject: `Your Students Resource Pack — Drive 4 Pass`,
      text: `Hello ${name},\n\nWell done on completing your first lesson with DRIVE 4 PASS!\n\nAs promised, here is your Students Resource Pack.\n\nKeep up the great work!\n\nWarm regards,\nDrive4pass Team`,
      attachments: [
        {
          filename: 'Students_Resource_Pack.pdf',
          path: path.join(__dirname, '../public/pdf/resource-pack.pdf')
        }
      ],
      html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family:Arial, Helvetica, sans-serif; background-color:#2a2a2a;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 15px;">
          <!-- Logo -->
          <div style="margin-bottom:20px; text-align:center;">
             <h1 style="color:#dc2626; margin:0; font-size:28px; letter-spacing:1px; font-weight:bold; font-style:italic;">DRIVE<span style="color:#16a34a;">4</span>PASS</h1>
          </div>
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; padding:0; border-radius:0;">
            <tr>
              <td style="padding:40px 30px;">
                <h2 style="color:#1f2937; margin-top:0; font-size:22px;">Your Students Resource Pack</h2>
                <p style="color:#374151; font-size:15px; margin-bottom:20px;">Hi ${name},</p>
                <p style="color:#374151; font-size:15px; line-height:1.6; margin-bottom:20px;">
                  Well done on completing your first lesson with <strong style="color:#dc2626;">DRIVE <span style="color:#16a34a;">4</span> PASS</strong>! We hope it went well.
                </p>
                <p style="color:#374151; font-size:15px; line-height:1.6; margin-bottom:25px;">
                  As promised, here is your <strong>Students Resource Pack</strong> with useful resources to help you on your journey to passing your test. The pack is attached to this email and you can also download it using the button below.
                </p>

                <!-- Green Card -->
                <div style="border-left:4px solid #16a34a; background-color:#f0fdf4; padding:20px; margin-bottom:25px;">
                  <p style="margin:0 0 10px 0; font-weight:bold; color:#1f2937; font-size:15px;">What's inside the pack</p>
                  <ul style="margin:0; padding-left:20px; color:#374151; font-size:14px; line-height:1.6;">
                    <li style="margin-bottom:6px;">Key information about your lessons and what to expect</li>
                    <li style="margin-bottom:6px;">Tips to help you progress between lessons</li>
                    <li>Useful resources to support your learning</li>
                  </ul>
                </div>

                <p style="color:#374151; font-size:15px; line-height:1.6; margin-bottom:20px;">
                  Keep up the great work! If you have any questions, just reply to this email or get in touch.
                </p>
                
                <p style="color:#374151; font-size:15px; margin-bottom:30px; line-height:1.6;">
                  Kind regards,<br/>
                  <strong>Drive 4 Pass Driving School</strong><br/>
                  <span style="font-size:13px; color:#6b7280;">Tel: 0333 335 7000 | Web: <a href="http://www.drive4pass.co.uk" style="color:#dc2626; text-decoration:none;">www.drive4pass.co.uk</a></span>
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color:#dc2626; padding:30px; text-align:center;">
                <p style="color:#ffffff; font-weight:bold; margin:0 0 15px 0; font-size:14px;">Call now and take the first step toward getting your driving licence!</p>
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:14px; font-weight:bold;">📞 0333 335 7000</p>
                <p style="color:#ffffff; margin:0 0 20px 0; font-size:14px; font-weight:bold;">💬 0739 912 1111</p>
                
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:11px; opacity:0.9;">Authorised & regulated by the DVSA</p>
                <p style="color:#ffffff; margin:0 0 20px 0; font-size:11px; opacity:0.9;">Co no 15780539</p>
                
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:10px; opacity:0.8;">All rights reserved Drive 4 Pass Driving School</p>
                <p style="color:#ffffff; margin:0; font-size:10px; opacity:0.8;">This is an automated email. Please do not reply to this email.</p>
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
    console.log("Resource pack email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Resource pack email error:", error);
    throw error;
  }
};
exports.SendReviewLinkMail = async (businessName, email, name) => {
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
      from: `"Drive4pass Team" <${process.env.EMAIL}>`,
      to: email,
      subject: `How did we do? We value your feedback! ⭐`,
      text: `Hello ${name},\n\nWe hope you had a fantastic experience with DRIVE 4 PASS!\n\nPlease take a minute to leave us a review on Google (https://g.page/r/Cff2QFoITfWXEBM/review) or Trustindex (https://www.trustindex.io/reviews/www.drive4pass.co.uk).\n\nThank you for your support!\n\nWarm regards,\nDrive4pass Team`,
      html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family:Arial, Helvetica, sans-serif; background-color:#2a2a2a;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 15px;">
          <!-- Logo -->
          <div style="margin-bottom:20px; text-align:center;">
             <h1 style="color:#dc2626; margin:0; font-size:28px; letter-spacing:1px; font-weight:bold; font-style:italic;">DRIVE<span style="color:#16a34a;">4</span>PASS</h1>
          </div>
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; padding:0; border-radius:0;">
            <tr>
              <td style="padding:40px 30px;">
                <h2 style="color:#1f2937; margin-top:0; font-size:22px; text-align:center;">How did we do? ⭐</h2>
                <p style="color:#374151; font-size:15px; margin-bottom:20px;">Hi ${name},</p>
                <p style="color:#374151; font-size:15px; line-height:1.6; margin-bottom:20px;">
                  We hope you had a fantastic experience learning to drive with <strong style="color:#dc2626;">DRIVE <span style="color:#16a34a;">4</span> PASS</strong>! 
                </p>
                <p style="color:#374151; font-size:15px; line-height:1.6; margin-bottom:30px;">
                  Your feedback means the world to us and helps other learner drivers choose the right driving school. If you have a spare minute, we would be incredibly grateful if you could leave us a quick review. 
                </p>

                <!-- Review Buttons Container -->
                <div style="text-align:center; margin-bottom:35px; padding: 25px 20px; background-color:#f9fafb; border-radius:8px; border:1px solid #e5e7eb;">
                  <p style="margin:0 0 20px 0; font-weight:bold; color:#1f2937; font-size:16px;">Please choose your preferred platform:</p>
                  
                  <!-- Google Review Button -->
                  <div style="margin-bottom:15px;">
                    <a href="https://g.page/r/Cff2QFoITfWXEBM/review" style="background-color:#ffffff; color:#374151; padding:14px 24px; text-decoration:none; font-weight:bold; border-radius:6px; display:inline-block; font-size:15px; border:2px solid #e5e7eb; width:220px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                       <span style="color:#4285F4; font-size:16px;">G</span><span style="color:#EA4335; font-size:16px;">o</span><span style="color:#FBBC05; font-size:16px;">o</span><span style="color:#4285F4; font-size:16px;">g</span><span style="color:#34A853; font-size:16px;">l</span><span style="color:#EA4335; font-size:16px;">e</span> Review
                    </a>
                  </div>

                  <!-- Trustindex Button -->
                  <div>
                    <a href="https://www.trustindex.io/reviews/www.drive4pass.co.uk" style="background-color:#00b67a; color:#ffffff; padding:14px 24px; text-decoration:none; font-weight:bold; border-radius:6px; display:inline-block; font-size:15px; border:2px solid #00b67a; width:220px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
                       ⭐ Trustindex Review
                    </a>
                  </div>
                </div>

                <p style="color:#374151; font-size:15px; line-height:1.6; margin-bottom:30px;">
                  Thank you so much for your support and for choosing us to help you on your driving journey!
                </p>
                
                <p style="color:#374151; font-size:15px; margin-bottom:0; line-height:1.6;">
                  Kind regards,<br/>
                  <strong>Drive 4 Pass Driving School</strong><br/>
                  <span style="font-size:13px; color:#6b7280;">Tel: 0333 335 7000 | Web: <a href="http://www.drive4pass.co.uk" style="color:#dc2626; text-decoration:none;">www.drive4pass.co.uk</a></span>
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color:#dc2626; padding:30px; text-align:center;">
                <p style="color:#ffffff; font-weight:bold; margin:0 0 15px 0; font-size:14px;">Call now and take the first step toward getting your driving licence!</p>
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:14px; font-weight:bold;">📞 0333 335 7000</p>
                <p style="color:#ffffff; margin:0 0 20px 0; font-size:14px; font-weight:bold;">💬 0739 912 1111</p>
                
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:11px; opacity:0.9;">Authorised & regulated by the DVSA</p>
                <p style="color:#ffffff; margin:0 0 20px 0; font-size:11px; opacity:0.9;">Co no 15780539</p>
                
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:10px; opacity:0.8;">All rights reserved Drive 4 Pass Driving School</p>
                <p style="color:#ffffff; margin:0; font-size:10px; opacity:0.8;">This is an automated email. Please do not reply to this email.</p>
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
    console.log("Review link email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Review link email error:", error);
    throw error;
  }
};

exports.SendWelcomeMessageMail = async (businessName, email, name) => {
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
      from: `"Drive4pass Team" <${process.env.EMAIL}>`,
      to: email,
      subject: `Welcome to Drive 4 Pass — your first lesson info 🎉`,
      text: `Hello ${name},\n\nThank you for booking your driving lessons with DRIVE 4 PASS.\n\nPlease be ready for your first lesson!\n\nWarm regards,\nDrive4pass Team`,
      attachments: [
        {
          filename: 'Welcome_To_Drive4Pass.pdf',
          path: path.join(__dirname, '../public/pdf/welcome.pdf')
        }
      ],
      html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family:Arial, Helvetica, sans-serif; background-color:#2a2a2a;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 15px;">
          <!-- Logo -->
          <div style="margin-bottom:20px; text-align:center;">
             <h1 style="color:#dc2626; margin:0; font-size:28px; letter-spacing:1px; font-weight:bold; font-style:italic;">DRIVE<span style="color:#16a34a;">4</span>PASS</h1>
          </div>
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; padding:0; border-radius:0;">
            <tr>
              <td style="padding:40px 30px;">
                <h2 style="color:#1f2937; margin-top:0; font-size:22px;">Welcome to Drive 4 Pass 🎉</h2>
                <p style="color:#374151; font-size:15px; margin-bottom:20px;">Hi ${name},</p>
                <p style="color:#374151; font-size:15px; line-height:1.6; margin-bottom:25px;">
                  Thank you for booking your driving lessons with <strong style="color:#dc2626;">DRIVE <span style="color:#16a34a;">4</span> PASS</strong>. We're looking forward to helping you become a safe, confident and independent driver.
                </p>

                <!-- Card 1 -->
                <div style="border-left:4px solid #dc2626; background-color:#fef2f2; padding:20px; margin-bottom:20px;">
                  <p style="margin:0 0 10px 0; font-weight:bold; color:#1f2937; font-size:15px;">Before your first lesson <span style="font-weight:normal; color:#6b7280; font-size:13px;">(please read)</span></p>
                  <p style="margin:0 0 10px 0; color:#374151; font-size:14px;">To make sure we can start your lesson smoothly, please bring:</p>
                  <ul style="margin:0 0 10px 0; padding-left:20px; color:#374151; font-size:14px; line-height:1.5;">
                    <li style="margin-bottom:6px;">Your <strong>UK provisional driving licence</strong> (your instructor must see it before the lesson can start)</li>
                    <li style="margin-bottom:6px;">Glasses/contact lenses if you need them for driving</li>
                    <li><strong>Thin-soled shoes/trainers</strong> (best for feeling the pedals and improving control)</li>
                  </ul>
                  <p style="margin:0; color:#6b7280; font-size:13px;">Please avoid flip-flops, sliders or high heels.</p>
                </div>

                <!-- Card 2 -->
                <div style="border-left:4px solid #16a34a; background-color:#f0fdf4; padding:20px; margin-bottom:20px;">
                  <p style="margin:0 0 10px 0; font-weight:bold; color:#1f2937; font-size:15px;">What happens in your first lesson</p>
                  <p style="margin:0 0 10px 0; color:#374151; font-size:14px;">Your instructor will quickly go over:</p>
                  <ul style="margin:0; padding-left:20px; color:#374151; font-size:14px; line-height:1.5;">
                    <li style="margin-bottom:6px;">A short meet & greet and safety briefing</li>
                    <li style="margin-bottom:6px;">Basic controls and cockpit checks (seat, steering, mirrors, etc.)</li>
                    <li>A plan based on your current experience level (complete beginner or some previous lessons)</li>
                  </ul>
                </div>

                <!-- Card 3 -->
                <div style="border-left:4px solid #eab308; background-color:#fefce8; padding:20px; margin-bottom:20px;">
                  <p style="margin:0 0 10px 0; font-weight:bold; color:#1f2937; font-size:15px;">Payments <span style="font-weight:normal; color:#6b7280; font-size:13px;">(important)</span></p>
                  <p style="margin:0 0 10px 0; color:#374151; font-size:14px;">Payment is made <strong>directly to your instructor</strong> at the start of each lesson, via:</p>
                  <ul style="margin:0 0 10px 0; padding-left:20px; color:#374151; font-size:14px; line-height:1.5;">
                    <li style="margin-bottom:6px;">Cash</li>
                    <li>Bank transfer</li>
                  </ul>
                  <p style="margin:0; color:#6b7280; font-size:13px;">Please note: Drive 4 Pass does not take lesson payments — your instructor will handle this with you directly.</p>
                </div>

                <!-- Card 4 -->
                <div style="border-left:4px solid #e5e7eb; background-color:#f9fafb; padding:20px; margin-bottom:30px;">
                  <p style="margin:0 0 10px 0; font-weight:bold; color:#1f2937; font-size:15px;">Quick reminders</p>
                  <ul style="margin:0; padding-left:20px; color:#374151; font-size:14px; line-height:1.5;">
                    <li style="margin-bottom:6px;">Please be ready on time at the agreed pick-up point.</li>
                    <li>If you need to change or cancel, please let your instructor know as early as possible (ideally 48 hours' notice).</li>
                  </ul>
                </div>

                <p style="color:#374151; font-size:15px; margin-bottom:20px;">If you have any questions before your first lesson, just reply to this email and we'll help.</p>
                
                <p style="color:#374151; font-size:15px; margin:0; line-height:1.6;">
                  Kind regards,<br/>
                  <strong>Drive 4 Pass Driving School</strong><br/>
                  <span style="font-size:13px; color:#6b7280;">Tel: 0333 335 7000 | Web: <a href="http://www.drive4pass.co.uk" style="color:#dc2626; text-decoration:none;">www.drive4pass.co.uk</a></span>
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color:#dc2626; padding:30px; text-align:center;">
                <p style="color:#ffffff; font-weight:bold; margin:0 0 15px 0; font-size:14px;">Call now and take the first step toward getting your driving licence!</p>
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:14px; font-weight:bold;">📞 0333 335 7000</p>
                <p style="color:#ffffff; margin:0 0 20px 0; font-size:14px; font-weight:bold;">💬 0739 912 1111</p>
                
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:11px; opacity:0.9;">Authorised & regulated by the DVSA</p>
                <p style="color:#ffffff; margin:0 0 20px 0; font-size:11px; opacity:0.9;">Co no 15780539</p>
                
                <p style="color:#ffffff; margin:0 0 5px 0; font-size:10px; opacity:0.8;">All rights reserved Drive 4 Pass Driving School</p>
                <p style="color:#ffffff; margin:0; font-size:10px; opacity:0.8;">This is an automated email. Please do not reply to this email.</p>
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
    console.log("Welcome message email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Welcome message email error:", error);
    throw error;
  }
};

exports.InstructorUpdateProfileMail = async (businessName, email, password, name) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  try {
    const info = await transporter.sendMail({
      from: `"${businessName} Team" <${process.env.EMAIL}>`,
      to: email,
      subject: `Your Login Details Have Been Updated - ${businessName}`,
      text: `Hello ${name},\n\nYour instructor profile has been updated. Here are your new login details:\nEmail: ${email}\nPassword: ${password}\n\nWarm regards,\n${businessName} Team`,
      html: `<p>Hello ${name},</p><p>Your instructor profile has been updated. Here are your new login details:</p><ul><li><strong>Email:</strong> ${email}</li><li><strong>Password:</strong> ${password}</li></ul><br><p>Warm regards,<br>${businessName} Team</p>`
    });
    console.log("Instructor profile update email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("InstructorUpdateProfileMail error:", error);
  }
};

exports.PupilInvitationMail = async (
  email,
  name,
  invitationCode
) => {
  const businessName = "Drive4Pass";

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
      subject: `You're Invited to Join ${businessName}`,

      text: `Hello ${name},

Welcome to ${businessName}!

You have been invited to join ${businessName} as a pupil.

Your invitation code is:

${invitationCode}

This invitation code is valid for 7 days only. Please complete your registration before the code expires.

If you did not expect this invitation, please contact the ${businessName} team.

We look forward to helping you on your driving journey.

Warm regards,
${businessName} Team`,

      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Drive4Pass Invitation</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: 'Inter', Helvetica, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 50px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">Drive4Pass</h1>
                      <p style="margin: 12px 0 0; color: #e0e7ff; font-size: 16px; font-weight: 400;">Your driving journey starts here</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 50px 40px;">
                      <h2 style="margin-top: 0; color: #111827; font-size: 26px; font-weight: 800; text-align: center;">You're Invited! 🚗</h2>
                      <p style="color: #4b5563; font-size: 17px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                        Hello <strong>${name}</strong>,<br><br>
                        Welcome to Drive4Pass! You have been exclusively invited to join us as a pupil. To complete your registration and activate your account, please use your unique invitation code below:
                      </p>

                      <!-- Invitation Code -->
                      <div style="background: linear-gradient(to right, #f3f4f6, #f8fafc); border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
                        <p style="margin: 0 0 15px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">YOUR INVITATION CODE</p>
                        <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; display: block; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: left; overflow-wrap: break-word; word-wrap: break-word; word-break: break-all;">
                          <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 500; font-family: monospace; line-height: 1.6;">${invitationCode}</p>
                        </div>
                      </div>

                      <!-- Expiry Warning -->
                      <div style="background-color: #fff1f2; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
                        <p style="margin: 0; color: #be123c; font-size: 15px; line-height: 1.5;">
                          <span style="font-size: 20px; display: block; margin-bottom: 5px;">⏳</span>
                          <strong>Time-sensitive:</strong> Your invitation code is valid for <strong>7 days only</strong>. Please complete your registration before the code expires.
                        </p>
                      </div>

                      <p style="color: #64748b; font-size: 15px; line-height: 1.6; text-align: center;">
                        If you did not expect this invitation, please ignore this email or contact the Drive4Pass team.
                      </p>

                      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;">

                      <p style="color: #0f172a; font-size: 16px; font-weight: 600; text-align: center; margin: 0;">
                        Warm regards,<br>
                        <span style="color: #4f46e5; font-size: 18px; display: inline-block; margin-top: 5px;">Drive4Pass Team</span>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0; color: #94a3b8; font-size: 13px;">© ${new Date().getFullYear()} Drive4Pass. All rights reserved.</p>
                      <p style="margin: 8px 0 0; color: #cbd5e1; font-size: 12px;">This is an automated email. Please do not reply directly.</p>
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

    console.log(
      "Pupil invitation email sent:",
      info.messageId
    );

    return info;

  } catch (error) {
    console.error(
      "PupilInvitationMail error:",
      error
    );
  }
};