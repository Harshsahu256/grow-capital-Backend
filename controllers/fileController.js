

const { uploadFileToSpaces, uploadMultipleFilesToSpaces } = require('../services/s3Service.js');
const FileUpload = require("../models/fileModel");
const User = require("../models/User.js");   // ✅ ADD THIS

// =================== ✅ 1. Single File Upload ===================
const uploadSingleFile = async (req, res) => {
  try {
    const file = req.file;
    console.log("Decoded user:", req.user);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const fileUrl = await uploadFileToSpaces(file);

    const savedFile = await FileUpload.create({
      fileName: file.originalname,
      fileUrl: fileUrl,
    uploadedBy: req.user.id,

      uploadedByEmail: req.user.email,
      amount: 0,
      status: "pending"
    });

    return res.status(200).json({
      message: "File uploaded successfully!",
      data: savedFile
    });

  } catch (error) {
    console.log("Upload Single File Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// =================== ✅ 2. Multiple File Upload ===================
const uploadMultipleFiles = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded!" });
    }

    const urls = await uploadMultipleFilesToSpaces(files);

    return res.status(200).json({
      message: "Files uploaded successfully!",
      urls,
    });
  } catch (error) {
    console.log("Upload Multiple File Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// ================= ✅ 3. Get All Files For Admin ==================
const getAllFilesForAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (userId) filter.uploadedBy = userId;
    if (search) filter.fileName = { $regex: search, $options: "i" };

    const total = await FileUpload.countDocuments(filter);

    const files = await FileUpload.find(filter)
      .populate("uploadedBy", "fullName email mobileNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      message: "Files fetched successfully",
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      files,
    });
  } catch (error) {
    console.error("Error fetching files for admin:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ================= ✅ 4. APPROVE FILE ==================
const approveFile = async (req, res) => {
  try {
    const { fileId, amount } = req.body;

    if (!fileId || !amount) {
      return res.status(400).json({ message: "fileId & amount are required!" });
    }

    // ✅ File find
    const file = await FileUpload.findById(fileId);

    if (!file) return res.status(404).json({ message: "File not found!" });

    // ✅ File pehle se approved?
    if (file.status === "approved") {
      return res.status(400).json({ message: "This file is already approved!" });
    }

    // ✅ User find
    const user = await User.findById(file.uploadedBy);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // ✅ User balance update
    user.totalAmount += Number(amount);
    await user.save();

    // ✅ File update
    file.amount = amount;
    file.status = "approved";
    await file.save();

    return res.status(200).json({
      message: "Approved Successfully",
      file,
      newBalance: user.totalAmount
    });

  } catch (error) {
    console.error("Error approving file:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const getUserDeposits = async (req, res) => {
  try {
    const userId = req.user.id;   // ✅ Token से आएगा

    const deposits = await FileUpload.find({ uploadedBy: userId })
      .sort({ createdAt: -1 });   // ✅ Latest first

    res.json({
      success: true,
      deposits
    });

  } catch (error) {
    console.error("Deposit fetch error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles,
  getAllFilesForAdmin,
  approveFile,
  getUserDeposits
};
