const express = require("express");
const { 
  getProductStock, 
  addStock, 
  updateStock, 
  deleteStock,
  getAllSizes,
  addSize,
  deleteSize
} = require("../controllers/stock-controller");
const authenticate = require("../middlewares/authenticate");
const stockRoute = express.Router();

// Stock management routes
stockRoute.get("/product/:productId", getProductStock);
stockRoute.post("/", authenticate, addStock);
stockRoute.patch("/:id", authenticate, updateStock);
stockRoute.delete("/:id", authenticate, deleteStock);

// Size management routes
stockRoute.get("/sizes", getAllSizes);
stockRoute.post("/sizes", authenticate, addSize);
stockRoute.delete("/sizes/:id", authenticate, deleteSize);

module.exports = stockRoute;