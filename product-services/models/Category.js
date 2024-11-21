const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  attributes: [
    {
      name: { type: String, required: true }, // Attribute name
      type: { type: String, required: true }, // Attribute type
    },
  ],
});

module.exports = mongoose.model("Category", categorySchema);
