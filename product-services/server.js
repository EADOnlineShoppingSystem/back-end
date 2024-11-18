const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const productRoutes = require('./routes/productRoutes'); // Adjust the path to match your folder structure

dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB

const app = express();

app.use(express.json()); // Middleware for parsing JSON

// Mount product routes
app.use('/api/products', productRoutes);

const PORT = process.env.PRODUCT_SERVICE_PORT || 6000; // Use a different port for product-services

app.listen(PORT, () => {
  console.log(`Product Service running on http://localhost:${PORT}`);
});
