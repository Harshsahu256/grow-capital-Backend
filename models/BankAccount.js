  const mongoose = require("mongoose");

  const bankAccountSchema = new mongoose.Schema({
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    ifscCode: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  module.exports = mongoose.model("BankAccount", bankAccountSchema);
