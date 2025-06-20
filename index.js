// index.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// --- IMPORT THE KEYWORD LOADER ---
const { loadBrandKeywords } = require('./utils/queryParser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connect
mongoose.connect("mongodb+srv://thisismanishrajput:2025Boxers25@cluster0.t0f7y3g.mongodb.net/ecommerce-ai?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// --- ADD THIS BLOCK ---
// Once the connection is open, pre-load the brand keywords
mongoose.connection.once('open', () => {
    loadBrandKeywords(); 
});
// --- END OF ADDED BLOCK ---


// Routes - Corrected path for ai route
app.use("/api/category", require("./routes/category"));
app.use("/api/product", require("./routes/product"));
app.use("/api/ai", require("./routes/ai")); // Make sure this path is correct

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));