const bcrypt = require("bcryptjs");
const User = require("../models/User");

const jwt = require("jsonwebtoken");
// ✅ Register User Controller
exports.registerUser = async (req, res) => {
  try {
    const { email, mobileNumber, password } = req.body;

    // Duplicate check
    const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// // ✅ Login User Controller
// exports.loginUser = async (req, res) => {
//   try {
//     const { emailOrMobile, password } = req.body;

//     // User check by email or mobile
//     const user = await User.findOne({
//       $or: [{ email: emailOrMobile }, { mobileNumber: emailOrMobile }]
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found!" });
//     }

//     // Password check
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid password!" });
//     }

//     res.json({ message: "Login successful!", user });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // ✅ Login User Controller
// exports.loginUser = async (req, res) => {
//   try {
//     const { email, mobileNumber, password } = req.body;

//     // User check by email or mobile number
//     const user = await User.findOne({
//       $or: [{ email }, { mobileNumber }]
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found!" });
//     }

//     // Password check
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid password!" });
//     }

//     res.status(200).json({
//       message: "Login successful!",
//       user: {
//         _id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         mobileNumber: user.mobileNumber
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    // 🔍 Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // 🔒 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔑 Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "7d" }
    );

    // ✅ Send response
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};