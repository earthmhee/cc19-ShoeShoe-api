// routes/outfit-route.js

const express = require("express");
const router = express.Router();
const outfitController = require("../controllers/outfit-controller");

// Add direct logging in the route
router.get("/recommendations/:productId", (req, res) => {
    console.log(`Outfit route hit with productId: ${req.params.productId}`);
    
    // Call the actual controller
    return outfitController.getOutfitRecommendations(req, res);
  });

module.exports = router;