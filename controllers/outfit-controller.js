// controllers/outfit-controller.js

const { generateOutfitRecommendations } = require('../services/ai-service');
const prisma = require("../config/prisma");

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
      console.log('Calling AI service for recommendations...');
      const recommendations = await generateOutfitRecommendations(product);
      
      // Return the recommendations with the correct structure
      return res.status(200).json({
        success: true,
        data: recommendations // This should already have the 'outfits' property
      });
    } catch (aiError) {
      console.error("AI Service Error:", aiError);
      
      // Return fallback recommendations instead of failing
      console.log('Using fallback recommendations due to AI service error');
      const fallbackRecommendations = getEnhancedFallbackRecommendations(product);
      
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

// Enhanced fallback recommendations function with more variety
function getEnhancedFallbackRecommendations(product) {
  const productNameLower = product.productname.toLowerCase();
  const isMens = product.gender === 'Men';
  const categoryName = product.category?.categoryname?.toLowerCase() || '';
  
  // Determine the product type for more specific recommendations
  const isRunningShoe = productNameLower.includes('running') || 
                        productNameLower.includes('athletic') || 
                        productNameLower.includes('sports');
  const isSandal = productNameLower.includes('sandal') || 
                  productNameLower.includes('slide') || 
                  categoryName.includes('sandal');
  const isCasual = productNameLower.includes('casual') || 
                  productNameLower.includes('sneaker') || 
                  categoryName.includes('sneaker');
  const isFormal = productNameLower.includes('formal') || 
                  productNameLower.includes('oxford') || 
                  productNameLower.includes('loafer');
  const isOutdoor = productNameLower.includes('hiking') || 
                    productNameLower.includes('trail') || 
                    productNameLower.includes('outdoor') ||
                    productNameLower.includes('hopara');
  
  // Base outfits collection
  let outfits = [];
  
  // Casual outfit - good for most shoes
  outfits.push({
    name: "Casual Weekend",
    style: "casual",
    description: `A versatile casual outfit that pairs perfectly with your ${product.productname}`,
    matchScore: 89,
    items: [
      {
        type: "top",
        name: isMens ? "Cotton T-shirt" : "Fitted T-shirt",
        brand: "Uniqlo",
        description: "A comfortable and stylish top for everyday wear"
      },
      {
        type: "bottom",
        name: isMens ? "Slim-fit jeans" : "High-waisted jeans",
        brand: "Levi's",
        description: "Classic jeans that go with everything"
      },
      {
        type: "accessory",
        name: isMens ? "Canvas Belt" : "Statement Necklace",
        brand: isMens ? "Herschel" : "Kate Spade",
        description: "The perfect finishing touch for your outfit"
      }
    ]
  });
  
  // Add a specific outfit based on shoe type
  if (isRunningShoe) {
    // Athletic outfit for running shoes
    outfits.push({
      name: "Athletic Performance",
      style: "sporty",
      description: `A performance-focused outfit to maximize the athletic design of your ${product.productname}`,
      matchScore: 95,
      items: [
        {
          type: "top",
          name: isMens ? "Performance T-shirt" : "Athletic Tank Top",
          brand: "Under Armour",
          description: "Moisture-wicking fabric to keep you cool during workouts"
        },
        {
          type: "bottom",
          name: isMens ? "Running Shorts" : "Athletic Leggings",
          brand: "Nike",
          description: "Designed for comfort during high-intensity activities"
        },
        {
          type: "accessory",
          name: "Sports Watch",
          brand: "Garmin",
          description: "Track your performance and stay on schedule"
        }
      ]
    });
  } else if (isSandal) {
    // Beach/summer outfit for sandals
    outfits.push({
      name: "Summer Outing",
      style: "casual",
      description: `A light, breezy outfit perfect for warm days with your ${product.productname}`,
      matchScore: 93,
      items: [
        {
          type: "top",
          name: isMens ? "Linen Shirt" : "Summer Blouse",
          brand: isMens ? "J.Crew" : "Zara",
          description: "Breathable fabric for hot summer days"
        },
        {
          type: "bottom",
          name: isMens ? "Chino Shorts" : "Flowing Skirt",
          brand: isMens ? "Gap" : "H&M",
          description: "Light and comfortable for warm weather"
        },
        {
          type: "accessory",
          name: isMens ? "Sunglasses" : "Straw Hat",
          brand: "Ray-Ban",
          description: "Essential protection from the sun with style"
        }
      ]
    });
  } else if (isOutdoor) {
    // Outdoor/hiking outfit
    outfits.push({
      name: "Trail Explorer",
      style: "casual",
      description: `A durable, functional outfit for outdoor adventures with your ${product.productname}`,
      matchScore: 97,
      items: [
        {
          type: "top",
          name: "Moisture-wicking Shirt",
          brand: "Columbia",
          description: "Keeps you dry and comfortable on the trail"
        },
        {
          type: "bottom",
          name: isMens ? "Convertible Hiking Pants" : "Hiking Shorts",
          brand: "The North Face",
          description: "Durable and versatile for any terrain"
        },
        {
          type: "accessory",
          name: "Trail Cap",
          brand: "Patagonia",
          description: "Protection from the elements during your adventures"
        }
      ]
    });
  } else if (isFormal) {
    // Business outfit for formal shoes
    outfits.push({
      name: "Business Professional",
      style: "business",
      description: `A polished, professional outfit that complements your ${product.productname}`,
      matchScore: 91,
      items: [
        {
          type: "top",
          name: isMens ? "Dress Shirt" : "Silk Blouse",
          brand: isMens ? "Brooks Brothers" : "Ann Taylor",
          description: "Crisp and professional for business settings"
        },
        {
          type: "bottom",
          name: isMens ? "Wool Dress Pants" : "Pencil Skirt",
          brand: "Banana Republic",
          description: "Tailored fit for a professional appearance"
        },
        {
          type: "accessory",
          name: isMens ? "Leather Belt" : "Pearl Earrings",
          brand: isMens ? "Allen Edmonds" : "Tiffany & Co",
          description: "Classic accessories to complete your business look"
        }
      ]
    });
  }
  
  // Add an elegant/dressy outfit for variety
  outfits.push({
    name: "Elegant Evening",
    style: "elegant",
    description: `A sophisticated outfit for special occasions with your ${product.productname}`,
    matchScore: 84,
    items: [
      {
        type: "top",
        name: isMens ? "Button-down Shirt" : "Silk Camisole",
        brand: isMens ? "Calvin Klein" : "Madewell",
        description: "Refined and elegant for special occasions"
      },
      {
        type: "bottom",
        name: isMens ? "Tailored Chinos" : "A-line Skirt",
        brand: isMens ? "Tommy Hilfiger" : "Club Monaco",
        description: "Sophisticated yet comfortable"
      },
      {
        type: "accessory",
        name: isMens ? "Leather Watch" : "Statement Bracelet",
        brand: isMens ? "Fossil" : "Michael Kors",
        description: "Adds a touch of elegance to complete your look"
      }
    ]
  });
  
  // Ensure we have at least 3 outfits, but no more than 3
  while (outfits.length > 3) {
    // Remove the outfit with the lowest match score
    let lowestScoreIndex = 0;
    let lowestScore = outfits[0].matchScore;
    
    for (let i = 1; i < outfits.length; i++) {
      if (outfits[i].matchScore < lowestScore) {
        lowestScore = outfits[i].matchScore;
        lowestScoreIndex = i;
      }
    }
    
    outfits.splice(lowestScoreIndex, 1);
  }
  
  return { outfits };
}

// Original fallback function kept for reference
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
          description: "A comfortable and stylish top"
        },
        {
          type: "bottom",
          name: isMens ? "Slim-fit jeans" : "Straight leg jeans",
          brand: "Denim Co",
          description: "Classic jeans that match everything"
        },
        {
          type: "accessory",
          name: isMens ? "Watch" : "Earrings",
          brand: "Accessories",
          description: "Complete your look with this accessory"
        }
      ]
    },
    {
      name: isMens ? "Business Professional" : "Office Chic",
      style: "business",
      description: `An elegant outfit that pairs perfectly with your ${product.productname}`,
      matchScore: 78,
      items: [
        {
          type: "top",
          name: isMens ? "Button-down shirt" : "Silk blouse",
          brand: "Premium",
          description: "A refined top for professional settings"
        },
        {
          type: "bottom",
          name: isMens ? "Chino pants" : "Pencil skirt",
          brand: "Business Attire",
          description: "Professional and comfortable"
        },
        {
          type: "accessory",
          name: isMens ? "Leather belt" : "Statement necklace",
          brand: "Accessories",
          description: "The perfect finishing touch"
        }
      ]
    }
  ];
  
  return { outfits };
}