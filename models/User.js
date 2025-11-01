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
  password: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);
