const express = require("express");
const { getAllCategories, getCategoryById } = require("../controllers/category-controller");
const categoryRoute = express.Router();

// Get all categories
categoryRoute.get("/", getAllCategories);

// Get category by ID
categoryRoute.get("/:id", getCategoryById);

module.exports = categoryRoute;