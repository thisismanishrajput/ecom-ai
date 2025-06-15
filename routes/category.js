const express = require("express");
const router = express.Router();
const { addCategory, getAllCategories } = require("../controllers/categoryController");

router.post("/add", addCategory);
router.get("/all", getAllCategories);

module.exports = router;
