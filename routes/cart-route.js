const express = require("express");
const cartRoute = express.Router();
const authMiddleware = require("../middlewares/authenticate");
const {
	viewcart,
	addcart,
	updateCartItem,
	removeCartItem,
	clearCart,
	checkout,
} = require("../controllers/cart-controller");

// cartRoute.get("/view-cart", authMiddleware, viewcart);
// cartRoute.post("/add-cart", authMiddleware, addcart);
// cartRoute.patch("/edit-cart");
// cartRoute.delete("/delete-cart");

//@endpoint http://localhost:8001/api/cart/view-cart
cartRoute.get("/view-cart", authMiddleware, viewcart);
cartRoute.post("/add-cart", authMiddleware, addcart);
cartRoute.put("/update-cart-item/:cartItemId", authMiddleware, updateCartItem);
cartRoute.delete(
	"/remove-cart-item/:cartItemId",
	authMiddleware,
	removeCartItem
);
cartRoute.delete("/clear-cart", authMiddleware, clearCart);
cartRoute.post("/checkout", authMiddleware, checkout);

module.exports = cartRoute;
