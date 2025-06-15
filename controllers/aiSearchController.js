const Product = require("../models/product");
const generateEmbedding = require("../utils/geminiEmbedding");

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB);
}

exports.searchWithVector = async (req, res) => {
  const userQuery = req.body.query;
  try {
    const queryEmbedding = await generateEmbedding(userQuery);
    if (!queryEmbedding) return res.status(500).json({ error: "Embedding failed" });

    const allProducts = await Product.find().populate("category");
    const productsWithScore = allProducts.map(product => {
      const score = cosineSimilarity(queryEmbedding, product.embedding);
      return { ...product.toObject(), score };
    });

    const sorted = productsWithScore.sort((a, b) => b.score - a.score).slice(0, 5);
    res.json({ query: userQuery, results: sorted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
