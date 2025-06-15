// scripts/addProducts.js
const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const generateEmbedding = require("../utils/geminiEmbedding");

mongoose.connect("mongodb://localhost:27017/ai-ecom");

(async () => {
  const categories = await Category.find().limit(20);
  const products = [];

  for (let i = 0; i < 100; i++) {
    const category = categories[i % categories.length];
    const name = `Test Product ${i + 1}`;
    const description = `This is a description for product ${i + 1} which belongs to ${category.name}`;
    const tags = ["tag1", "tag2", "dry hair", "Loreal", "hairfall"];
    const brand = i % 2 === 0 ? "Loreal" : "Dove";
    const fullText = `${name} ${description} ${tags.join(" ")} ${brand}`;

    const embedding = await generateEmbedding(fullText);

    products.push({
      name,
      description,
      tags,
      brand,
      price: 100 + i,
      gender: i % 2 === 0 ? "Women" : "Men",
      imageUrl: "https://example.com/images/product.jpg",
      category: category._id,
      embedding,
    });
  }

  await Product.insertMany(products);
  console.log("100 products inserted.");
  mongoose.disconnect();
})();
