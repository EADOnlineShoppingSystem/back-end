const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
});

module.exports = mongoose.model("Category", categorySchema);
