// /controllers/aiController.js

const Product = require("../models/product");
const generateEmbedding = require("../utils/geminiEmbedding");
const { parseQueryForFilters } = require("../utils/queryParser"); // <-- IMPORT THE PARSER

exports.searchWithVector = async (req, res) => {
  const rawUserQuery = req.body.query; // This is the full user sentence
  
  if (!rawUserQuery) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    // --- THIS IS THE NEW STEP ---
    // 1. Parse the raw query to extract filters and a clean query for the vector search
    const { cleanQuery, filters } = await parseQueryForFilters(rawUserQuery);
    console.log(`Original Query: "${rawUserQuery}" -> Clean Query: "${cleanQuery}", Filters:`, filters);
    // --- END OF NEW STEP ---
    
    // 2. Generate embedding from the CLEAN query. If the query is just a filter, it might be empty.
    // In that case, we can use a generic term or the raw query. Let's use the raw query as a fallback.
    const queryForEmbedding = cleanQuery || rawUserQuery;
    const queryEmbedding = await generateEmbedding(queryForEmbedding);
    
    if (!queryEmbedding) {
      return res.status(500).json({ error: "Failed to generate query embedding" });
    }

    // 3. Build the vector search stage using the EXTRACTED filters
    const vectorSearchStage = {
      index: "vector_index",
      path: "embedding",
      queryVector: queryEmbedding,
      numCandidates: 100,
      limit: 10,
    };

    // If the parser found any filters, add the MQL filter clause
    if (Object.keys(filters).length > 0) {
      vectorSearchStage.filter = filters;
    }

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
    
    // Return the original query, the extracted filters, and the results for clarity
    res.json({ 
      originalQuery: rawUserQuery, 
      extractedFilters: filters, 
      queryUsedForEmbedding: queryForEmbedding,
      results 
    });

  } catch (err) {
    console.error("Vector search error:", err);
    res.status(500).json({ error: err.message });
  }
};