const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  attributes: Object, // e.g., { colors: ["Red", "Blue"], storage: ["64GB", "128GB"] }
  priceRange: {
    min: Number,
    max: Number,
  },
  availableStock: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
