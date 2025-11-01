const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");

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