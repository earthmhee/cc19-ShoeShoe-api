const express = require("express");
const cartRoute = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { viewcart, addcart } = require("../controllers/cart-controller");

cartRoute.get("/view-cart", authMiddleware, viewcart);
cartRoute.post("/add-cart", authMiddleware, addcart);
cartRoute.patch("/edit-cart");
cartRoute.delete("/delete-cart");

module.exports = cartRoute;
