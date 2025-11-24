
  const mongoose = require("mongoose");

  const FileUploadSchema = new mongoose.Schema({
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: { type: Number, default: 0 },

    status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending"
  },
    
    createdAt: {
      type: Date,
      default: Date.now
    }
    

  });

  module.exports = mongoose.model("FileUpload", FileUploadSchema);
