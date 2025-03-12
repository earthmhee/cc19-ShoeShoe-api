const express = require('express');
const { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } = require('../controllers/wishlist-controller');
const authenticate = require('../middlewares/authenticate');
const wishlistRoute = express.Router();

// All wishlist routes require authentication
wishlistRoute.use(authenticate);

// Get user's wishlist
wishlistRoute.get('/', getWishlist);

// Add product to wishlist
wishlistRoute.post('/', addToWishlist);

// Remove product from wishlist
wishlistRoute.delete('/:id', removeFromWishlist);

// Clear all items from wishlist
wishlistRoute.delete('/', clearWishlist);

module.exports = wishlistRoute;