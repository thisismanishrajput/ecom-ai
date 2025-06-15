const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  gender: { type: String, enum: ["Men", "Women", "Unisex"], default: "Unisex" },
  tags: [String],
  imageUrl: String,
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
