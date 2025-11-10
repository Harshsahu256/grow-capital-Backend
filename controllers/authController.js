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

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token with role
 const token = jwt.sign(
  { id: user._id, role: "user" },
  process.env.JWT_SECRET || "growb_secret_key",  // 🔄 same secret as verifyUser
  { expiresIn: "7d" }
);


    // Send response
    res.status(200).json({
      message: "Login successful!",
      token,
        user: {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    accountNumber: user.accountNumber,
    ifscCode: user.ifscCode
  },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getMyTotalAmount = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      message: "User total amount fetched successfully",
      userId: user._id,
      fullName: user.fullName,
      totalAmount: user.totalAmount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};