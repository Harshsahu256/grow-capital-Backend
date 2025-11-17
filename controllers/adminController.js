const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const sendEmail = require("../models/utils/emailSender");
const generateUniqueCode = require("../models/utils/generateUniqueCode");


const JWT_SECRET = "growb_secret_key"; // ✅ apne hisab se env me store kar sakte ho

// ✅ Admin Register Controller
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Email duplicate check
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists!" });
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ Admin Login Controller (with JWT Token)
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin find
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    // Password check
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    // ✅ JWT Token generate
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Admin login successful!",
      token, // ← token response me milega
      admin
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


// ✅ Get All Users (Only Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // password hide karenge
    res.json({
      message: "All registered users fetched successfully!",
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


// exports.approveUser = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     // 1️⃣ Find user by ID
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found." });

//     // 2️⃣ Check if already approved
//     if (user.status === "approved") {
//       return res.status(400).json({ message: "User is already approved." });
//     }

//     // 3️⃣ Generate unique login code
//     const uniqueCode = generateUniqueCode();
//     user.uniqueLoginCode = uniqueCode;

//     // 4️⃣ Update status
//     user.status = "approved";

//     // 5️⃣ Save changes
//     await user.save();

//     // 6️⃣ Prepare email content (unique code + original password)
//     const emailHtml = `
//       <h2>Your Account Has Been Approved!</h2>
//       <p>Dear ${user.fullName},</p>
//       <p>Your login credentials are below:</p>
//       <p><b>Login Code:</b> ${uniqueCode}</p>
//       <p><b>Password:</b> ${user.passwordShow}</p>
//       <p>Use these credentials on the login page.</p>
//       <p>Regards,<br/>Grow Capital Team</p>
//     `;

//     // 7️⃣ Send email
//     const emailSent = await sendEmail(user.email, "Your Grow Capital Login Details", emailHtml);

//     if (emailSent) {
//       res.status(200).json({ message: `User ${user.fullName} approved and email sent!` });
//     } else {
//       res.status(200).json({ message: `User ${user.fullName} approved, but email failed.` });
//     }

//   } catch (error) {
//     console.error("Approve user error:", error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// };





// exports.approveUser = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     // Find user
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Already approved?
//     if (user.status === "approved") {
//       return res.status(400).json({ message: "User is already approved." });
//     }

//     // Generate login code (Client ID)
//     const loginCode = generateUniqueCode();
//     user.uniqueLoginCode = loginCode;

//     // Approve user
//     user.status = "approved";
//     await user.save();

//     // Email content
//     const emailHtml = `
//       <h2>Your Grow Capital Account is Approved!</h2>
//       <p>Hello ${user.fullName},</p>
//       <p>Your login credentials are:</p>
//       <p><b>Client ID:</b> ${loginCode}</p>
//       <p><b>Password:</b> ${user.passwordShow}</p>
//       <p>Please use these credentials to log in.</p>
//       <br/>
//       <p>Regards,<br/>Grow Capital Team</p>
//     `;

//     // Send Email
//     const emailSent = await sendEmail(
//       user.email,
//       "Grow Capital Login Credentials",
//       emailHtml
//     );

//     // Response
//     return res.status(200).json({
//       message: emailSent
//         ? "User approved & email sent!"
//         : "User approved but email sending failed.",
//       loginDetails: {
//         clientId: loginCode,
//         password: user.passwordShow,
//       },
//     });

//   } catch (error) {
//     console.error("Approve user error:", error);
//     return res.status(500).json({ message: "Server Error", error });
//   }
// };


exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Already approved?
    if (user.status === "approved") {
      return res.status(400).json({ message: "User is already approved." });
    }

    // Generate login code (Client ID)
    const loginCode = generateUniqueCode();

    // Email content
    const emailHtml = `
      <h2>Your Grow Capital Account is Approved!</h2>
      <p>Hello ${user.fullName},</p>
      <p>Your login credentials are:</p>
      <p><b>Client ID:</b> ${loginCode}</p>
      <p><b>Password:</b> ${user.passwordShow}</p>
      <p>Please use these credentials to log in.</p>
      <br/>
      <p>Regards,<br/>Grow Capital Team</p>
    `;

    // Attempt to send email
    const emailSent = await sendEmail(
      user.email,
      "Grow Capital Login Credentials",
      emailHtml
    );

    if (!emailSent) {
      // Email failed → do not approve
      return res.status(500).json({
        message: "Email sending failed. User not approved.",
      });
    }

    // Email sent successfully → approve user
    user.uniqueLoginCode = loginCode;
    user.status = "approved";
    await user.save();

    return res.status(200).json({
      message: "User approved & email sent!",
      loginDetails: {
        clientId: loginCode,
        password: user.passwordShow,
      },
    });

  } catch (error) {
    console.error("Approve user error:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};






// Optional: Admin Reject User (similar to approve, but sets status to 'rejected')
exports.rejectUser = async (req, res) => {
  try {
    const { userId, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.status === "rejected") {
      return res.status(400).json({ message: "User is already rejected." });
    }

    user.status = "rejected";
    await user.save();

    const emailSubject = "Your GrowAdmin Account Registration Status";
    const emailHtml = `
      <p>Dear ${user.fullName},</p>
      <p>We regret to inform you that your GrowAdmin account registration has been rejected by our administrators.</p>
      ${reason ? `<p>Reason: ${reason}</p>` : ''}
      <p>Please contact support if you believe this is an error or for further assistance.</p>
      <br>
      <p>Thank you,</p>
      <p>The GrowAdmin Team</p>
    `;

    const emailSent = await sendEmail(user.email, emailSubject, emailHtml);

    if (emailSent) {
      res.status(200).json({ message: `User ${user.fullName} rejected and email sent successfully!` });
    } else {
      res.status(200).json({ message: `User ${user.fullName} rejected, but failed to send notification email.` });
    }

  } catch (error) {
    console.error("Reject user error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Optional: Get all pending users for admin dashboard
exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: "pending" }).select('-password'); // Exclude password
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Get pending users error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};