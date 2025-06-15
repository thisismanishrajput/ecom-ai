const express = require("express");
const router = express.Router();

const { askAI } = require("../controllers/aiController");
const { searchWithVector } = require("../controllers/aiSearchController");

router.post("/vector-search", searchWithVector);
router.post("/ask-ai", askAI);

module.exports = router;
