const mongoose = require("mongoose");

const userEmailVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure one verification record per email
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiredAt: {
    type: Date,
    required: true, // Timestamp for when the OTP expires
  },
});

module.exports = mongoose.model("userEmailVerification", userEmailVerificationSchema);
