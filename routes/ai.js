const express = require("express");
const router = express.Router();
const { askAI } = require("../controllers/aiController");

router.post("/ask-ai", askAI);

module.exports = router;
