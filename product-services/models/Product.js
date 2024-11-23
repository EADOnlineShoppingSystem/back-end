const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  productTitle: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  lowestPrice: {
    type: Number,
    required: true,
  },
  largestPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  tag: {
    type: String,
  },
  warranty: {
    type: String, // e.g., "6 months", "1 year"
  },
  storages: {
    type: [String], // Array of storage options, e.g., ["64GB", "128GB"]
  },
  colors: {
    type: [String], // Array of color options, e.g., ["Red", "Blue"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
