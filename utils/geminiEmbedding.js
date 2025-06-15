const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_EMBED_URL = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${GEMINI_API_KEY}`;

async function generateEmbedding(text) {
  try {
    const res = await axios.post(GEMINI_EMBED_URL, {
      model: "models/embedding-001",
      content: { parts: [{ text }] },
    });
    return res.data.embedding.values;
  } catch (err) {
    console.error("Embedding error:", err.response?.data || err.message);
    return null;
  }
}

module.exports = generateEmbedding;
