// controllers/outfit-controller.js

const { generateOutfitRecommendations } = require('../services/ai-service');
const prisma = require("../config/prisma");

// controllers/outfit-controller.js
exports.getOutfitRecommendations = async (req, res, next) => {
    try {
      const { productId } = req.params;
      
      console.log(`Generating outfits for product ID: ${productId}`);
      
      if (!productId) {
        return res.status(400).json({ 
          success: false, 
          message: "Product ID is required" 
        });
      }
      
      // Get the product details from your database
      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) },
        include: {
          category: true
        }
      });
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: "Product not found" 
        });
      }
      
      console.log(`Found product: ${product.productname}`);
      
      try {
        // Call the AI service to generate recommendations
        const recommendations = await generateOutfitRecommendations(product);
        
        // Return the recommendations
        return res.status(200).json({
          success: true,
          data: recommendations
        });
      } catch (aiError) {
        console.error("AI Service Error:", aiError);
        
        // Return fallback recommendations instead of failing
        const fallbackRecommendations = getFallbackRecommendations(product);
        
        return res.status(200).json({
          success: true,
          data: fallbackRecommendations,
          fallback: true
        });
      }
    } catch (error) {
      console.error("Error in outfit recommendation controller:", error);
      
      return res.status(500).json({
        success: false,
        message: "Failed to generate outfit recommendations",
        error: error.message
      });
    }
  };
  
  // Make sure to add this function if it doesn't exist
  function getFallbackRecommendations(product) {
    const isMens = product.gender === 'Men';
    const isCasual = product.category?.categoryname?.toLowerCase().includes('sneaker');
    
    const outfits = [
      {
        name: isCasual ? "Weekend Casual" : "Smart Casual",
        style: "casual",
        description: `A versatile outfit that works well with your ${product.productname}`,
        matchScore: 85,
        items: [
          {
            type: "top",
            name: isMens ? "Cotton T-shirt" : "Blouse",
            brand: "Basic",
            price: 25.99,
            description: "A comfortable and stylish top"
          },
          {
            type: "bottom",
            name: isMens ? "Slim-fit jeans" : "Straight leg jeans",
            brand: "Denim Co",
            price: 49.99,
            description: "Classic jeans that match everything"
          },
          {
            type: "accessory",
            name: isMens ? "Watch" : "Earrings",
            brand: "Accessories",
            price: 29.99,
            description: "Complete your look with this accessory"
          }
        ]
      }
    ];
    
    return { outfits };
  }