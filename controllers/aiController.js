const axios = require("axios");
const Product = require("../models/product");
const Category = require("../models/category");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

exports.askAI = async (req, res) => {
  const { query } = req.body;

  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    // 🔹 Step 1: Call Gemini API to extract intent
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
You are a product search assistant for an e-commerce store.
Extract the following from the user's query:
- category
- gender
- tags (skin concern, product type, etc.)

Return ONLY JSON in the format:

{
  "category": "Skincare",
  "gender": "Men",
  "tags": ["oily skin", "cleanser"]
}

User query: "${query}"
                `,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 🔹 Step 2: Parse the AI response
    const text = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI response is not parsable as JSON");

    const parsed = JSON.parse(jsonMatch[0]);

    // 🔹 Step 3: Find category from DB
    const categoryDoc = await Category.findOne({ name: parsed.category });
    if (!categoryDoc) return res.status(404).json({ error: "Category not found" });

    // 🔹 Step 4: Exact product match
    const products = await Product.find({
      category: categoryDoc._id,
      gender: parsed.gender,
      tags: { $in: parsed.tags },
    }).populate("category");

    let suggestedProducts = [];
    let message = "Exact matches found.";

    // 🔹 Step 5: Fallback if no products found
    if (products.length === 0) {
      message = "No exact matches found. Here are some similar products.";

      // Partial match: same category and tags, ignoring gender
      suggestedProducts = await Product.find({
        category: categoryDoc._id,
        tags: { $in: parsed.tags },
      }).populate("category");

      // Only category match as last fallback
      if (suggestedProducts.length === 0) {
        suggestedProducts = await Product.find({
          category: categoryDoc._id,
        }).populate("category");

        message = "No exact or partial match found. Showing other products from the same category.";
      }
    }

    // 🔹 Step 6: Return response
    res.json({
      aiExtractedFilters: parsed,
      products,
      suggestedProducts,
      message,
    });
  } catch (err) {
    console.error("askAI error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
