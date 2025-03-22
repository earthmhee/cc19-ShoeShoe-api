const OpenAI = require('openai');

// This function will call OpenAI API to generate outfit recommendations
async function generateOutfitRecommendations(product) {
  try {
    console.log(`Generating AI outfit recommendations for: ${product.productname}`);
    
    // Use OpenAI API for more reliable results
    try {
      // Initialize the OpenAI client
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, // Make sure to add this to your .env file
      });
      
      // Updated prompt for better outfit recommendations
      const prompt = `
You are a professional fashion stylist. Create 3 outfit recommendations for the following footwear:
Product: ${product.productname}
Brand: ${product.brand}
Gender: ${product.gender}
Category: ${product.category?.categoryname || 'footwear'}
For each outfit, provide:
1. A clear name for the outfit style (e.g., "Weekend Casual", "Business Professional")
2. The style category (choose one: casual, business, elegant, sporty)
3. A brief description that explains why this outfit works well with the footwear
4. A match score from 80-98% indicating how well the outfit pairs with the footwear
5. Three specific clothing items to complete the look:
   - Top: Be very specific about the type (e.g., "Cotton Crew-Neck T-shirt", "Oxford Button-Down Shirt")
   - Bottom: Be very specific about the type (e.g., "Distressed Slim-Fit Jeans", "Tailored Wool Dress Pants")
   - Accessory: Be very specific about the type (e.g., "Leather Chronograph Watch", "Knitted Beanie Hat")
For each clothing item, include a realistic brand name that would make this item.
Use this format for each outfit:
Outfit 1: [NAME]
Style: [CATEGORY]
Description: [DESCRIPTION]
Match Score: [SCORE]%
Top: [SPECIFIC TOP NAME] by [BRAND]
Bottom: [SPECIFIC BOTTOM NAME] by [BRAND]
Accessory: [SPECIFIC ACCESSORY NAME] by [BRAND]
Make sure each outfit is distinctly different from the others. Consider the shoe's style, color, and formality level.
`;

      // Call the OpenAI API with updated system message
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // You can use "gpt-4" for better results if you have access
        messages: [
          { role: "system", content: "You are a fashion expert and stylist specializing in outfit recommendations." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });
      
      // Get the generated text
      const generatedText = completion.choices[0].message.content;
      
      if (!generatedText) {
        throw new Error("No recommendations received from OpenAI");
      }
      
      console.log("Successfully generated recommendations with OpenAI");
      
      // Parse the generated text into structured outfit recommendations
      const outfits = parseOutfitsFromOpenAI(generatedText, product);
      
      return { outfits };
      
    } catch (openaiError) {
      console.error("OpenAI API Error:", openaiError.message);
      throw openaiError;
    }
  } catch (error) {
    console.error("Error in generateOutfitRecommendations:", error.message);
    
    // Return fallback recommendations in case of error
    return getFallbackRecommendations(product);
  }
}

// Updated parser specifically designed for OpenAI's output format
function parseOutfitsFromOpenAI(text, product) {
  try {
    // Split text into outfit sections using the new format
    // Looking for "Outfit #:" pattern
    const outfitSections = text.split(/(?:^|\n)(?:Outfit)\s*\d+\s*:/i)
      .filter(section => section.trim().length > 0);
    
    // If no clear sections, try different approaches
    let parsedOutfits = [];
    
    if (outfitSections.length >= 2) {
      // Parse each outfit section
      parsedOutfits = outfitSections.map(section => {
        // Extract outfit name - first line after "Outfit #:"
        const nameMatch = section.match(/^\s*(.+?)(?:\n|$)/i);
        const name = nameMatch ? nameMatch[1].trim() : "Stylish Outfit";
        
        // Extract style
        const styleMatch = section.match(/(?:^|\n)(?:Style):\s*(.+?)(?:\n|$)/i);
        const style = styleMatch ? styleMatch[1].trim().toLowerCase() : "casual";
        
        // Extract description
        const descMatch = section.match(/(?:^|\n)(?:Description):\s*(.+?)(?:\n|$)/i);
        const description = descMatch ? descMatch[1].trim() : 
          `A ${style} outfit that pairs perfectly with your ${product.productname}.`;
        
        // Extract match score
        const scoreMatch = section.match(/(?:^|\n)(?:Match Score):\s*(\d+)/i);
        const matchScore = scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(Math.random() * 15) + 83;
        
        // Extract items
        const items = [];
        
        // Look for top with brand information
        const topMatch = section.match(/(?:^|\n)(?:Top):\s*(.+?)(?:\n|$)/i);
        if (topMatch) {
          const topText = topMatch[1].trim();
          const brandMatch = topText.match(/(.+?)\s+by\s+(.+)$/) || topText.match(/(.+?)\s+from\s+(.+)$/);
          
          items.push({
            type: "top",
            name: brandMatch ? brandMatch[1].trim() : topText,
            brand: brandMatch ? brandMatch[2].trim() : guessBrandForItem("top", product.gender),
            description: `A stylish ${style} top to pair with your shoes`
          });
        }
        
        // Look for bottom with brand information
        const bottomMatch = section.match(/(?:^|\n)(?:Bottom):\s*(.+?)(?:\n|$)/i);
        if (bottomMatch) {
          const bottomText = bottomMatch[1].trim();
          const brandMatch = bottomText.match(/(.+?)\s+by\s+(.+)$/) || bottomText.match(/(.+?)\s+from\s+(.+)$/);
          
          items.push({
            type: "bottom",
            name: brandMatch ? brandMatch[1].trim() : bottomText,
            brand: brandMatch ? brandMatch[2].trim() : guessBrandForItem("bottom", product.gender),
            description: `Perfect ${style} bottoms to complete your look`
          });
        }
        
        // Look for accessory with brand information
        const accessoryMatch = section.match(/(?:^|\n)(?:Accessory):\s*(.+?)(?:\n|$)/i);
        if (accessoryMatch) {
          const accessoryText = accessoryMatch[1].trim();
          const brandMatch = accessoryText.match(/(.+?)\s+by\s+(.+)$/) || accessoryText.match(/(.+?)\s+from\s+(.+)$/);
          
          items.push({
            type: "accessory",
            name: brandMatch ? brandMatch[1].trim() : accessoryText,
            brand: brandMatch ? brandMatch[2].trim() : guessBrandForItem("accessory", product.gender),
            description: `The perfect accessory to enhance your ${style} look`
          });
        }
        
        // If we don't have enough items, add default ones
        if (items.length < 3) {
          const defaultItems = createDefaultItems(product.gender, style);
          
          // Add missing item types
          const missingTypes = ["top", "bottom", "accessory"].filter(
            type => !items.some(item => item.type === type)
          );
          
          for (const type of missingTypes) {
            const defaultItem = defaultItems.find(item => item.type === type);
            if (defaultItem) {
              items.push(defaultItem);
            }
          }
        }
        
        return {
          name,
          style,
          description,
          matchScore,
          items
        };
      });
    }
    
    // If we couldn't parse properly or don't have enough outfits, use fallbacks
    if (parsedOutfits.length < 3) {
      const fallbackStyles = ["casual", "business", "elegant"];
      while (parsedOutfits.length < 3) {
        const style = fallbackStyles[parsedOutfits.length];
        parsedOutfits.push(createThematicOutfit(product, style));
      }
    }
    
    return parsedOutfits;
  } catch (parseError) {
    console.error("Error parsing outfits from OpenAI:", parseError);
    
    // Return default outfits if parsing fails
    return [
      createThematicOutfit(product, "casual"),
      createThematicOutfit(product, "business"),
      createThematicOutfit(product, "elegant")
    ];
  }
}

// Helper function to guess a brand based on item type and gender
function guessBrandForItem(type, gender) {
  const brandsByType = {
    top: {
      Men: ['Nike', 'Ralph Lauren', 'H&M', 'Zara', 'Uniqlo', 'Gap', 'J.Crew'],
      Women: ['Zara', 'H&M', 'Madewell', 'J.Crew', 'Gap', 'Uniqlo', 'Free People'],
    },
    bottom: {
      Men: ['Levi\'s', 'Dockers', 'Gap', 'H&M', 'Uniqlo', 'Dickies', 'Carhartt'],
      Women: ['Levi\'s', 'Zara', 'H&M', 'Madewell', 'Gap', 'American Eagle', 'Uniqlo'],
    },
    accessory: {
      Men: ['Fossil', 'Ray-Ban', 'Timex', 'Herschel', 'Nixon', 'Casio', 'Seiko'],
      Women: ['Michael Kors', 'Kate Spade', 'Ray-Ban', 'Madewell', 'Kendra Scott'],
    }
  };
  
  const brands = brandsByType[type][gender] || brandsByType[type]['Men'];
  return brands[Math.floor(Math.random() * brands.length)];
}

// Create default items for a given gender and style
function createDefaultItems(gender, style) {
  const isMens = gender === 'Men';
  
  return [
    {
      type: "top",
      name: isMens ? 
        (style === 'formal' ? "Button-down Oxford Shirt" : "Cotton T-shirt") : 
        (style === 'formal' ? "Silk Blouse" : "Fitted T-shirt"),
      brand: isMens ?
        (style === 'formal' ? "Brooks Brothers" : "Uniqlo") :
        (style === 'formal' ? "Ann Taylor" : "Madewell"),
      description: `A versatile ${style} top`
    },
    {
      type: "bottom",
      name: isMens ?
        (style === 'formal' ? "Wool Dress Pants" : "Slim-fit Jeans") :
        (style === 'formal' ? "Pencil Skirt" : "High-waisted Jeans"),
      brand: isMens ?
        (style === 'formal' ? "Banana Republic" : "Levi's") :
        (style === 'formal' ? "Banana Republic" : "Madewell"),
      description: `${style.charAt(0).toUpperCase() + style.slice(1)} bottoms for any occasion`
    },
    {
      type: "accessory",
      name: isMens ?
        (style === 'formal' ? "Leather Watch" : "Canvas Belt") :
        (style === 'formal' ? "Pearl Earrings" : "Statement Necklace"),
      brand: isMens ?
        (style === 'formal' ? "Fossil" : "Herschel") :
        (style === 'formal' ? "Kate Spade" : "Madewell"),
      description: "The perfect accessory to complete your look"
    }
  ];
}

// Create a thematic outfit based on a style
function createThematicOutfit(product, baseStyle) {
  const gender = product.gender;
  const isMens = gender === 'Men';
  
  // Customize style and description based on shoe type
  let style = baseStyle.toLowerCase();
  let shoeName = product.productname.toLowerCase();
  let theme = "";
  
  // Try to customize the outfit based on the shoe type
  if (shoeName.includes("sneaker") || shoeName.includes("athletic")) {
    theme = "Athleisure";
    style = "sporty";
  } else if (shoeName.includes("boot")) {
    theme = "Rugged";
    style = "casual";
  } else if (shoeName.includes("loafer") || shoeName.includes("oxford")) {
    theme = "Smart";
    style = "business";
  } else if (shoeName.includes("sandal")) {
    theme = "Relaxed";
    style = "casual";
  } else if (shoeName.includes("heel") || shoeName.includes("pump")) {
    theme = "Elegant"; 
    style = "formal";
  } else if (shoeName.includes("running") || shoeName.includes("speedgoat")) {
    theme = "Active";
    style = "sporty";
  }
  
  // Fall back to base style if no specific theme was detected
  if (!theme) {
    theme = baseStyle.charAt(0).toUpperCase() + baseStyle.slice(1);
  }
  
  // Create the outfit items based on the determined style
  const items = createDefaultItems(gender, style);
  
  // Calculate a match score - slightly random to feel realistic
  const matchScore = 85 + Math.floor(Math.random() * 10);
  
  return {
    name: `${theme} ${style.charAt(0).toUpperCase() + style.slice(1)}`,
    style: style,
    description: `A ${style} outfit that pairs perfectly with your ${product.productname}.`,
    matchScore: matchScore,
    items: items
  };
}

// Fallback function with improved variety
function getFallbackRecommendations(product) {
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

module.exports = { generateOutfitRecommendations };