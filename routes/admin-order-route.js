const express = require("express");
const { 
  getAllOrders, 
  updateOrderStatus, 
  searchOrders,
  getOrderById
} = require("../controllers/admin-order-controller");
const authenticate = require("../middlewares/authenticate");
const adminOrderRoute = express.Router();

// All routes require authentication
adminOrderRoute.use(authenticate);

// Get all orders with filtering, sorting, pagination
adminOrderRoute.get("/orders", getAllOrders);

// Search orders
adminOrderRoute.get("/orders/search", searchOrders);

// Get order by ID
adminOrderRoute.get("/orders/:id", getOrderById);

// Update order status
adminOrderRoute.patch("/orders/:id/status", updateOrderStatus);

module.exports = adminOrderRoute;