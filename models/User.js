// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   dob: { type: String, required: true },
//   mobileNumber: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   panCardNumber: { type: String, required: true },
//   ifscCode: { type: String, required: true },
//   bankName: { type: String, required: true },
//   bankBranchName: { type: String, required: true },
//   accountNumber: { type: String, required: true },
//   aadharNumber: { type: String, required: true },
//   nomineeName: { type: String, required: true },
//   nomineeRelation: { type: String, required: true },
//   nomineeAadhar: { type: String, required: true },
//   password: { type: String, required: true },
//    totalAmount: { type: Number, default: 0 }
// });

// module.exports = mongoose.model("User", userSchema);


// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   dob: { type: String, required: true },
//   mobileNumber: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   panCardNumber: { type: String, required: true },
//   ifscCode: { type: String, required: true },
//   bankName: { type: String, required: true },
//   bankBranchName: { type: String, required: true },
//   accountNumber: { type: String, required: true },
//   aadharNumber: { type: String, required: true },
//   nomineeName: { type: String, required: true },
//   nomineeRelation: { type: String, required: true },
//   nomineeAadhar: { type: String, required: true },
//   password: { type: String, required: true },
//   totalAmount: { type: Number, default: 0 },
//   // 🔴 NEW FIELD: Add a status field for admin approval
//   status: {
//     type: String,
//     enum: ["pending", "approved", "rejected"],
//     default: "pending", // New users start as 'pending'
//   },
// }, { timestamps: true }); // Optional: Add timestamps for createdAt/updatedAt

// module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   dob: { type: String, required: true },
//   mobileNumber: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   panCardNumber: { type: String, required: true },
//   ifscCode: { type: String, required: true },
//   bankName: { type: String, required: true },
//   bankBranchName: { type: String, required: true },
//   accountNumber: { type: String, required: true },
//   aadharNumber: { type: String, required: true },
//   nomineeName: { type: String, required: true },
//   nomineeRelation: { type: String, required: true },
//   nomineeAadhar: { type: String, required: true },
//   password: { type: String, required: true },
//   totalAmount: { type: Number, default: 0 },

//   // 🔴 New field: Admin approval status
//   status: {
//     type: String,
//     enum: ["pending", "approved", "rejected"],
//     default: "pending",
//   },

//   // 🔴 New field: Unique login code for approved users
//   uniqueLoginCode: { type: String }, // will store 6-digit code
// }, { timestamps: true });


// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  panCardNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  bankName: { type: String, required: true },
  bankBranchName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  nomineeName: { type: String, required: true },
  nomineeRelation: { type: String, required: true },
  nomineeAadhar: { type: String, required: true },

  // Hashed password
  password: { type: String, required: true },

  // ⭐ ORIGINAL password (email me bhejne ke liye)
  passwordShow: { type: String, required: false },

  totalAmount: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  uniqueLoginCode: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
