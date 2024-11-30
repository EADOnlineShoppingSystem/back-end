const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
