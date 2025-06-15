// /controllers/productController.js

const Product = require("../models/product");
const Category = require("../models/category"); // Import Category model
const generateEmbedding = require("../utils/geminiEmbedding");

exports.addProduct = async (req, res) => {
  try {
    const { name, description, tags, brand, gender, category: categoryId } = req.body;

    // --- IMPROVEMENT START ---
    // 1. Fetch the category document to get its name
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // 2. Create a richer, more descriptive text for embedding
    const fullText = `
      Product Name: ${name}.
      Brand: ${brand}.
      Gender: ${gender}.
      Category: ${category.name}.
      Description: ${description}.
      Tags: ${tags?.join(", ")}.
    `;
    // --- IMPROVEMENT END ---

    const embedding = await generateEmbedding(fullText);
    if (!embedding) {
      return res.status(500).json({ error: "Failed to generate embedding" });
    }

    const product = new Product({ ...req.body, embedding });
    await product.save();
    
    // Populate category before sending the response
    const populatedProduct = await Product.findById(product._id).populate("category");
    res.status(201).json(populatedProduct);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ... aother controller functions remain the same
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};