const express = require("express");
const { showproduct, addproduct, updateproduct } = require("../controllers/product-controller");
const productRoute = express.Router();

productRoute.get("/show-product", showproduct);
productRoute.post("/add-product", addproduct);
productRoute.patch("/update-product/:id", updateproduct);
productRoute.delete("/delete-product/:id");

module.exports = productRoute