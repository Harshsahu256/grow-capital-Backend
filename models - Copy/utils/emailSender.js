// const nodemailer = require("nodemailer");
// require("dotenv").config(); // Load environment variables

// const sendEmail = async (to, subject, htmlContent) => {
//   try {
//     // 1. Create a Nodemailer transporter
//     //    Configure with your SMTP service details.
//     //    For testing, you can use ethereal.email or a real service like Gmail.
//     //    If using Gmail, enable "Less secure app access" or use an App Password.
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST, // e.g., 'smtp.gmail.com'
//       port: process.env.EMAIL_PORT, // e.g., 587 (for TLS) or 465 (for SSL)
//       secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
//       auth: {
//         user: process.env.EMAIL_USER,     // Your email address
//         pass: process.env.EMAIL_PASS,     // Your email password or App Password
//       },
//     });

//     // 2. Define email options
//     const mailOptions = {
//       from: process.env.EMAIL_USER, // Sender address
//       to: to,                      // List of receivers
//       subject: subject,            // Subject line
//       html: htmlContent,           // HTML body
//     };

//     // 3. Send the email
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Message sent: %s", info.messageId);
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info)); // Only for Ethereal
//     return true;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return false;
//   }
// };

// module.exports = sendEmail;

// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const sendEmail = async (to, subject, htmlContent) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       secure: process.env.EMAIL_SECURE === "true", // TLS false, SSL true
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"GrowAdmin" <${process.env.EMAIL_USER}>`, // sender name + email
//       to,
//       subject,
//       html: htmlContent,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent:", info.messageId);
//     return true;
//   } catch (error) {
//     console.error("❌ Error sending email:", error);
//     return false;
//   }
// };

// module.exports = sendEmail;


// utils/sendEmail.js
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load .env variables

/**
 * sendEmail - Function to send emails via SMTP
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} htmlContent - HTML content of the email
 * @returns {boolean} - true if email sent successfully, false otherwise
 */
const sendEmail = async (to, subject, htmlContent) => {
  try {
    // 1️⃣ Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,           // e.g., smtp.gmail.com
      port: parseInt(process.env.EMAIL_PORT), // 587 for TLS, 465 for SSL
      secure: process.env.EMAIL_SECURE === "true", // true = SSL, false = TLS
      auth: {
        user: process.env.EMAIL_USER,         // Sender Gmail address
        pass: process.env.EMAIL_PASS,         // Gmail App Password
      },
    });

    // 2️⃣ Define mail options
    const mailOptions = {
      from: `"GrowAdmin" <${process.env.EMAIL_USER}>`, // Display name + email
      to,                     // Recipient email
      subject,                // Subject line
      html: htmlContent,      // HTML body
    };

    // 3️⃣ Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.messageId);
    if (process.env.NODE_ENV !== "production") {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info)); // Only for Ethereal
    }

    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};

module.exports = sendEmail;



// // utils/sendEmail.js
// const nodemailer = require("nodemailer");
// require("dotenv").config();
 
// /**
// * sendEmail - Function to send emails via SMTP
// */
// // const sendEmail = async (to, subject, htmlContent) => {
// //   try {
// //     const transporter = nodemailer.createTransport({
// //       host: process.env.EMAIL_HOST,       // mail.smigc.in
// //       port: parseInt(process.env.EMAIL_PORT), // 465
// //       secure: process.env.EMAIL_SECURE === "true",
// //       auth: {
// //         user: process.env.EMAIL_USER,     // info@smigc.in
// //         pass: process.env.EMAIL_PASS,     // email password
// //       },
// //       tls: {
// //         rejectUnauthorized: false,
// //       },
// //     });
 
// //     const mailOptions = {
// //       from: `"GrowAdmin" <${process.env.EMAIL_USER}>`,
// //       to,
// //       subject,
// //       html: htmlContent,
// //     };
 
// //     const info = await transporter.sendMail(mailOptions);
 
// //     console.log("Email Sent:", info.messageId);
// //     return true;
// //   } catch (error) {
// //     console.error("Email Error:", error);
// //     return false;
// //   }
// // };


// const sendEmail = require("../utils/sendEmail");
// const User = require("../models/User");
// const generateUniqueCode = require("../../models/utils/generateUniqueCode");
 
// exports.approveUser = async (req, res) => {
//   try {
//     const { userId } = req.body;
 
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found." });
 
//     if (user.status === "approved") {
//       return res.status(400).json({ message: "User already approved." });
//     }
 
//     const uniqueCode = generateUniqueCode();
//     user.uniqueLoginCode = uniqueCode;
//     user.status = "approved";
 
//     await user.save();
 
//     const emailHtml = `
// <h2>Your Account Has Been Approved!</h2>
// <p>Dear ${user.fullName},</p>
// <p>Your login credentials:</p>
// <p><b>Login Code:</b> ${uniqueCode}</p>
// <p><b>Password:</b> ${user.passwordShow}</p>
// <p>Use these credentials to login.</p>
// <p>Regards,<br/>Grow Capital Team</p>
//     `;
 
//     const emailSent = await sendEmail(
//       user.email,
//       "Your Grow Capital Login Details",
//       emailHtml
//     );
 
//     if (emailSent) {
//       res.status(200).json({
//         message: `User ${user.fullName} approved and email sent!`,
//       });
//     } else {
//       res.status(200).json({
//         message: `User ${user.fullName} approved, but email sending failed.`,
//       });
//     }
//   } catch (error) {
//     console.error("Approve user error:", error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// };
 
// module.exports = sendEmail;