// /controllers/aiController.js

const Product = require("../models/product");
const generateEmbedding = require("../utils/geminiEmbedding");

exports.searchWithVector = async (req, res) => {
  const { query: userQuery, filters } = req.body;

  if (!userQuery) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const queryEmbedding = await generateEmbedding(userQuery);
    if (!queryEmbedding) {
      return res.status(500).json({ error: "Failed to generate query embedding" });
    }

    const vectorSearchStage = {
      index: "vector_index",
      path: "embedding",
      queryVector: queryEmbedding,
      numCandidates: 100,
      limit: 10,
    };

    // --- CORRECTION: Build a standard MQL filter object ---
    if (filters && Object.keys(filters).length > 0) {
      // Create a standard MongoDB filter document.
      // e.g., { gender: "Men", brand: "Dior" }
      const mqlFilter = {};

      if (filters.gender) {
        mqlFilter.gender = filters.gender;
      }
      if (filters.brand) {
        mqlFilter.brand = filters.brand;
      }
      
      // Assign the MQL filter directly to the 'filter' property.
      vectorSearchStage.filter = mqlFilter;
    }
    // --- END OF CORRECTION ---

    const pipeline = [
      { $vectorSearch: vectorSearchStage },
      {
        $project: {
          score: { $meta: "vectorSearchScore" },
          name: 1, description: 1, price: 1, category: 1, gender: 1,
          tags: 1, imageUrl: 1, brand: 1, createdAt: 1, updatedAt: 1,
        },
      },
      {
        $lookup: {
          from: "categories", localField: "category", foreignField: "_id", as: "category",
        },
      },
      { $unwind: "$category" }
    ];

    const results = await Product.aggregate(pipeline);
    res.json({ query: userQuery, filters: filters || {}, results });

  } catch (err) {
    console.error("Vector search error:", err);
    res.status(500).json({ error: err.message });
  }
};