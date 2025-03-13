const express = require("express");
const { placeOrder, viewOrder, deleteOrder } = require("../controllers/order-controller");
const authenticate = require("../middlewares/authenticate");
const orderRoute = express.Router();

// Route to place a new order 
orderRoute.post("/place-order", authenticate, placeOrder);

// Route to delete an order 
orderRoute.delete("/delete-order/:id", authenticate, deleteOrder);

// Route to view orders - can be all user orders or specific order by ID 
orderRoute.get("/view-order/:id?", authenticate, viewOrder);

module.exports = orderRoute;