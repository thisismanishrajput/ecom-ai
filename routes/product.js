const express = require("express");
const router = express.Router();
const { addProduct, getAllProducts } = require("../controllers/productController");

router.post("/add", addProduct);
router.get("/all", getAllProducts);

module.exports = router;
