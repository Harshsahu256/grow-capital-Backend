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
      return res.status(400).json({ message: "User already exists with this email or mobile number!" });
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user with 'pending' status
    const newUser = new User({
      ...req.body,
      password: hashedPassword,   // 🔐 hashed password
      passwordShow: password,     // ⭐ original password (for email)
      status: "pending",          // 🔴 default pending
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully! Awaiting admin approval." });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};



exports.loginUser = async (req, res) => {
  try {
    const { code, password } = req.body;

    // 1️⃣ Validate
    if (!code || !password) {
      return res.status(400).json({ message: "Login Code and password are required!" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ uniqueLoginCode: code });

    if (!user) {
      return res.status(404).json({ message: "Invalid Login Code!" });
    }

    // 3️⃣ Check password
    if (user.passwordShow !== password) {
      return res.status(401).json({ message: "Incorrect password!" });
    }

    // 4️⃣ Check approval
    if (user.status !== "approved") {
      return res.status(403).json({ message: "Account pending approval." });
    }

    // 5️⃣ Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        role: "user",
        name: user.name,
        clientId: user.uniqueLoginCode,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6️⃣ Send Response
    return res.status(200).json({
      message: "Login successful!",
      token,             // 👈 VERY IMPORTANT
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        clientId: user.uniqueLoginCode,
        phone: user.phone,
        status: user.status,
        ifscCode: user.ifscCode,
        accountNumber: user.accountNumber,
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
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


exports.getProfile =  async (req, res) => {
  try {
    // req.user should have the userId from token
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

