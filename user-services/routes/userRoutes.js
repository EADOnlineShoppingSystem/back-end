const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust to your file path
const bcrypt = require('bcrypt'); // For password hashing

// Create New User
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Respond with the created user (excluding password)
    res.status(201).json({
      id: newUser._id,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      isVerified: newUser.isVerified,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
