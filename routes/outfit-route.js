// routes/outfit-route.js

const express = require("express");
const router = express.Router();
const outfitController = require("../controllers/outfit-controller");


// Route to get outfit recommendations for a specific product
router.get("/recommendations/:productId", outfitController.getOutfitRecommendations);

module.exports = router;