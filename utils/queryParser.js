// /utils/queryParser.js
const Product = require('../models/product');

// Define static keywords for gender
const GENDER_KEYWORDS = {
  "Men": ["men", "man", "male", "for him", "brother", "husband", "boyfriend", "guy", "guys"],
  "Women": ["women", "woman", "female", "for her","sister", "wife", "girlfriend","lady", "ladies","mom", "mother"],
  "Unisex": ["unisex", "for all", "for everyone", "for all"],
  "Kids": ["kids", "kid", "child", "children", "baby", "toddler", "for kids", "for children", "for babies", "for toddlers"]
};

// We will fetch brand names dynamically from the database
let brandKeywords = [];

// Function to load and cache brand names
async function loadBrandKeywords() {
  if (brandKeywords.length === 0) {
    console.log("Loading brand keywords from database...");
    // Fetches all unique, non-null brand names
    const brands = await Product.distinct("brand");
    brandKeywords = brands.filter(b => b); // Filter out null/empty values
    console.log(`Loaded ${brandKeywords.length} brands.`);
  }
  return brandKeywords;
}

async function parseQueryForFilters(rawQuery) {
  await loadBrandKeywords(); // Make sure brands are loaded
  
  let cleanQuery = rawQuery.toLowerCase();
  const filters = {};

  // 1. Extract Gender
  for (const [genderValue, keywords] of Object.entries(GENDER_KEYWORDS)) {
    for (const keyword of keywords) {
      if (cleanQuery.includes(` ${keyword} `) || cleanQuery.endsWith(` ${keyword}`) || cleanQuery.startsWith(`${keyword} `)) {
        if (!filters.gender) { // Only take the first gender found
            filters.gender = genderValue;
            cleanQuery = cleanQuery.replace(new RegExp(keyword, 'gi'), '').trim();
        }
      }
    }
  }

  // 2. Extract Brand
  for (const brand of brandKeywords) {
    if (cleanQuery.includes(brand.toLowerCase())) {
        if (!filters.brand) { // Only take the first brand found
            filters.brand = brand;
            cleanQuery = cleanQuery.replace(new RegExp(brand, 'gi'), '').trim();
        }
    }
  }

  return { cleanQuery, filters };
}

module.exports = { parseQueryForFilters, loadBrandKeywords };