const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const userEmailVerificationModel = require("../models/userEmailVerificationModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Email Transporter Configuration
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kanishkazoysa1234@gmail.com", // Replace with your email
    pass: "sldh spke vqbu znhw",         // Replace with your app password
  },
});

// Reusable Email Sending Function
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: "kanishkazoysa1234@gmail.com",
    to: email,
    subject: "Email Verification OTP",
    html: `
      <p>Your OTP for verifying your email is: <strong>${otp}</strong>.</p>
      <p>The OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent to:", email);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Error sending OTP email.");
  }
};

// Register Route
router.post("/register", async (req, res) => {
  const { username,email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user as unverified
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });
    await newUser.save();

    // Save OTP details in database
    const otpRecord = new userEmailVerificationModel({
      email,
      otp,
      createdAt: new Date(),
      expiredAt: otpExpiry,
    });
    await otpRecord.save();

    // Send OTP Email
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "User registered successfully. OTP sent to email." });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Verify OTP Route
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if OTP exists for the email
    const otpRecord = await userEmailVerificationModel.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP or email." });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiredAt) {
      await userEmailVerificationModel.findOneAndDelete({ email });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Mark user as verified
    await User.findOneAndUpdate({ email }, { isVerified: true });

    // Remove the OTP record
    await userEmailVerificationModel.findOneAndDelete({ email });

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Resend OTP Route
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified." });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60000);

    // Save or update OTP in the database
    await userEmailVerificationModel.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date(), expiredAt: otpExpiry },
      { upsert: true } // Create if it doesn't exist
    );

    // Send OTP Email
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "New OTP sent to email." });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ message: "Server error." });
  }
});

//Login Rote
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "User is not verified. Please verify your email." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET, // Use a secure secret stored in the .env file
      { expiresIn: "1d" } // Token validity (e.g., 1 day)
    );

    // Send response with the token
    res.status(200).json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error." });
  }
});

//forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist." });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    // Save OTP in the database
    await userEmailVerificationModel.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date(), expiredAt: otpExpiry },
      { upsert: true } // Create if it doesn't exist
    );

    // Send OTP via email
    const mailOptions = {
      from: "kanishkazoysa1234@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP for resetting your password is: <strong>${otp}</strong>.</p>
             <p>The OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error." });
  }
});

//verify-password-otp
router.post("/verify-reset-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if OTP exists for the email
    const otpRecord = await userEmailVerificationModel.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP or email." });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiredAt) {
      await userEmailVerificationModel.findOneAndDelete({ email });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // OTP is valid
    res.status(200).json({ message: "OTP verified successfully. You can now reset your password." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error." });
  }
});

//Reset password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    // Check if both passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Remove OTP record after successful password reset
    await userEmailVerificationModel.findOneAndDelete({ email });

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error." });
  }
});


// Get User Details by ID
router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Find user by ID
    const user = await User.findById(userId).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error." });
  }
});

//get all users 
router.get("/getAllUsers", async (req , res) =>{
  try{
    const users = await User.find();
    res.status(200).json(users);
  }
  catch(error){
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error." });
  }
})




module.exports = router;
