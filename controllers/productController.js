const Product = require("../models/product");
const generateEmbedding = require("../utils/geminiEmbedding");

exports.addProduct = async (req, res) => {
  try {
    const { name, description, tags, brand } = req.body;
    const fullText = `${name} ${description} ${tags?.join(" ")} ${brand}`;

    const embedding = await generateEmbedding(fullText);
    if (!embedding) {
      return res.status(500).json({ error: "Failed to generate embedding" });
    }

    const product = new Product({ ...req.body, embedding });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
