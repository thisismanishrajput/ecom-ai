const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connect
mongoose.connect("mongodb+srv://thisismanishrajput:2025Boxers25@cluster0.t0f7y3g.mongodb.net/ecommerce-ai?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/category", require("./Routes/category"));
app.use("/api/product", require("./Routes/product"));
app.use("/api/ai", require("./routes/ai"));

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
