const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  gender: String,
  tags: [String],
  imageUrl: String,
  brand: String, // optional, if you're supporting brand-based query
  embedding: [Number], // NEW FIELD for vector embedding
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
