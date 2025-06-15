// scripts/addCategories.js
const mongoose = require("mongoose");
const Category = require("../models/category");

const categories = [
  { name: "Skincare", description: "Skincare products" },
  { name: "Haircare", description: "Haircare essentials" },
  { name: "Makeup", description: "Cosmetics and makeup" },
  { name: "Fragrance", description: "Perfumes and deodorants" },
  { name: "Bodycare", description: "Lotions, creams" },
  { name: "Shampoo", description: "All shampoo products" },
  { name: "Conditioner", description: "Hair conditioners" },
  { name: "Serum", description: "Facial and hair serums" },
  { name: "Facewash", description: "Face cleansers" },
  { name: "Moisturizer", description: "Skin hydration products" },
  { name: "Lotion", description: "Body lotions" },
  { name: "Sunscreen", description: "Sun protection products" },
  { name: "Lipcare", description: "Lip balms, scrubs" },
  { name: "Eye care", description: "Dark circles, puffiness" },
  { name: "Men", description: "Men’s grooming" },
  { name: "Women", description: "Women-focused products" },
  { name: "Kids", description: "Kids grooming and skincare" },
  { name: "Oral care", description: "Toothpaste, mouthwash" },
  { name: "Foot care", description: "Foot creams, scrubs" },
  { name: "Bath", description: "Soaps, shower gels" },
];

mongoose.connect("mongodb+srv://thisismanishrajput:2025Boxers25@cluster0.t0f7y3g.mongodb.net/ecommerce-ai?retryWrites=true&w=majority").then(async () => {
  await Category.insertMany(categories);
  console.log("Categories inserted");
  mongoose.disconnect();
});
