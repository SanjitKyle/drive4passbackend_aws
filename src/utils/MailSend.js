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
      from: `"${businessName} Team" <${process.env.EMAIL}>`,
      to: email,
      subject: `Your Students Resource Pack — Drive 4 Pass`,
      text: `Hello ${name},\n\nWell done on completing your first lesson with DRIVE 4 PASS!\n\nAs promised, here is your Students Resource Pack.\n\nKeep up the great work!\n\nWarm regards,\n${businessName} Team`,
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
      from: `"${businessName} Team" <${process.env.EMAIL}>`,
      to: email,
      subject: `How did we do? We value your feedback! ⭐`,
      text: `Hello ${name},\n\nWe hope you had a fantastic experience with DRIVE 4 PASS!\n\nPlease take a minute to leave us a review on Google (https://g.page/r/Cff2QFoITfWXEBM/review) or Trustindex (https://www.trustindex.io/reviews/www.drive4pass.co.uk).\n\nThank you for your support!\n\nWarm regards,\n${businessName} Team`,
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
      from: `"${businessName} Team" <${process.env.EMAIL}>`,
      to: email,
      subject: `Welcome to Drive 4 Pass — your first lesson info 🎉`,
      text: `Hello ${name},\n\nThank you for booking your driving lessons with DRIVE 4 PASS.\n\nPlease be ready for your first lesson!\n\nWarm regards,\n${businessName} Team`,
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
