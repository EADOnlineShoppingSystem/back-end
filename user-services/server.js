// index.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db'); // Database connection file
const userRoutes = require('./routes/userRoutes'); // Adjust the path as needed

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // <-- This line is essential for parsing JSON

app.use('/api/users', userRoutes); // Mount user routes at /api/users

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
