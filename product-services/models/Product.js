const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  productTitle: { type: String, required: true },
  productDescription: { type: String, required: true },
  lowestPrice: { type: Number, required: true },
  largestPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  tag: { type: String },
  warranty: { type: String },
  storages: { type: [String] },
  colors: { type: [String] },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ], // Array of image URLs and public IDs
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
