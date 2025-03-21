// services/ai-service.js
const axios = require('axios');

// This function will call Hugging Face API to generate outfit recommendations
async function generateOutfitRecommendations(product) {
  try {
    // Create an enhanced prompt with specific instructions for better structured output
    const enhancedPrompt = `
As a fashion expert, generate 3 complete outfit recommendations that would match perfectly with:
- Product: ${product.productname}
- Brand: ${product.brand}
- Gender: ${product.gender}
- Category: ${product.category?.categoryname || 'footwear'}

For each outfit, include:
1. A name for the outfit style
2. A brief description
3. Top item (specific type, suggested brand, approximate price)
4. Bottom item (specific type, suggested brand, approximate price)
5. 1-2 accessories (specific type, suggested brand, approximate price)

Format your response as a clear list with numbered outfits.
IMPORTANT: Consider the shoe color, material, and occasion when making recommendations.
`;

    // Using Hugging Face API with a larger model for better quality
    const response = await axios.post(
      // You can try different models: bigscience/bloom, gpt2-xl, etc.
      'https://api-inference.huggingface.co/models/bigscience/bloom', 
      {
        inputs: enhancedPrompt,
        parameters: {
          max_length: 800,  // Increased for more detailed responses
          temperature: 0.7,
          top_p: 0.9,       // Controls diversity
          num_return_sequences: 1,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Process the response from Hugging Face
    const generatedText = response.data[0]?.generated_text;
    
    if (!generatedText) {
      throw new Error("Failed to generate outfit recommendations");
    }

    // Parse and structure the generated text into outfits
    const outfits = parseOutfitsFromText(generatedText, product);
    
    return { outfits };
  } catch (error) {
    console.error("Error generating outfit recommendations:", error);
    
    // Return fallback recommendations in case of error
    return getFallbackRecommendations(product);
  }
}

// Improved parsing function to better handle structured output
function parseOutfitsFromText(text, product) {
  try {
    // Create a regex pattern to identify numbered outfit sections
    const outfitPattern = /Outfit\s*(\d+)|(\d+)\s*\.\s*|Recommendation\s*(\d+)/gi;
    
    // Split the text by outfit patterns
    let sections = text.split(outfitPattern).filter(Boolean);
    
    // If the splitting didn't work as expected, try another approach
    if (sections.length <= 1) {
      // Look for numbered lists or sections
      sections = text.split(/\n\s*\d+[\.\)]\s*/).filter(Boolean);
    }
    
    if (sections.length <= 1) {
      // Last resort: split by double newlines which often separate sections
      sections = text.split(/\n\n+/).filter(Boolean);
    }
    
    // If we still don't have enough sections, create default outfits
    if (sections.length < 3) {
      return [
        createThematicOutfit(product, "Casual"),
        createThematicOutfit(product, "Business"),
        createThematicOutfit(product, "Weekend")
      ];
    }
    
    // Process each section into an outfit
    return sections.slice(0, 3).map((section, index) => {
      // Get the style name - either from the first line or by detecting style keywords
      const lines = section.split('\n').filter(line => line.trim().length > 0);
      
      // Try to extract a name from the first line
      let name = lines[0]?.trim().replace(/^[:-]\s*/, '') || `Outfit ${index + 1}`;
      
      // If the name is too long, it's probably not just a name
      if (name.length > 30) {
        name = extractStyleName(section) || `Outfit ${index + 1}`;
      }
      
      // Detect the style from the text
      const style = extractStyle(section);
      
      // Extract description - use first two sentences if possible
      const description = extractDescription(section) || 
        `A ${style} outfit that complements your ${product.productname} perfectly.`;
      
      // Extract outfit items
      const items = extractOutfitItems(section, product.gender);
      
      // If we couldn't extract enough items, add some defaults
      if (items.length < 3) {
        const defaults = createDefaultItems(product.gender, style);
        while (items.length < 3) {
          const missingTypes = ['top', 'bottom', 'accessory'].filter(
            type => !items.some(item => item.type === type)
          );
          
          if (missingTypes.length > 0) {
            const defaultItem = defaults.find(item => item.type === missingTypes[0]);
            if (defaultItem) items.push(defaultItem);
            else break;
          } else {
            break;
          }
        }
      }
      
      // Calculate a realistic match score based on text analysis
      // More detailed/specific text = higher score
      const matchQuality = section.length > 200 ? 'high' : 
                           section.length > 100 ? 'medium' : 'low';
      const baseScore = matchQuality === 'high' ? 92 : 
                        matchQuality === 'medium' ? 88 : 85;
      const matchScore = baseScore + Math.floor(Math.random() * 7);
      
      return {
        name: name,
        style: style,
        description: description,
        matchScore: matchScore,
        items: items
      };
    });
  } catch (parseError) {
    console.error("Error parsing outfits from text:", parseError);
    return [
      createThematicOutfit(product, "Casual"),
      createThematicOutfit(product, "Business"),
      createThematicOutfit(product, "Weekend")
    ];
  }
}

// Extract a style name from text
function extractStyleName(text) {
  // Check for style keywords followed by words like "look", "outfit", "style", etc.
  const styleNameMatches = text.match(/(casual|formal|business|sporty|elegant|vintage|boho|streetwear|chic|preppy|minimalist|urban)\s+(look|outfit|style|ensemble|attire)/i);
  
  if (styleNameMatches) {
    return styleNameMatches[0].charAt(0).toUpperCase() + styleNameMatches[0].slice(1);
  }
  
  // Or just look for a style keyword
  const styleKeywordMatch = text.match(/(casual|formal|business|sporty|elegant|vintage|boho|streetwear|chic|preppy|minimalist|urban)/i);
  
  if (styleKeywordMatch) {
    return styleKeywordMatch[0].charAt(0).toUpperCase() + styleKeywordMatch[0].slice(1) + " Style";
  }
  
  return null;
}

// Extract the overall style from text
function extractStyle(text) {
  const styleMap = {
    casual: ['casual', 'relaxed', 'laid-back', 'everyday', 'comfy', 'comfortable'],
    formal: ['formal', 'elegant', 'sophisticated', 'dressy', 'polished', 'classy'],
    business: ['business', 'professional', 'office', 'work', 'corporate'],
    sporty: ['sporty', 'athletic', 'active', 'workout', 'gym', 'sports'],
    streetwear: ['streetwear', 'urban', 'street style', 'hypebeast', 'trendy'],
    vintage: ['vintage', 'retro', 'classic', 'old-school', 'throwback'],
    bohemian: ['bohemian', 'boho', 'free-spirited', 'hippie', 'earthy']
  };
  
  // Check text against each style's keywords
  for (const [style, keywords] of Object.entries(styleMap)) {
    for (const keyword of keywords) {
      if (text.toLowerCase().includes(keyword)) {
        return style;
      }
    }
  }
  
  // Default to casual if no style is detected
  return 'casual';
}

// Extract a description from text
function extractDescription(text) {
  // Look for 1-2 complete sentences that aren't about specific items
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  for (const sentence of sentences) {
    // Skip item-specific sentences
    if (!sentence.match(/(top|bottom|shirt|pant|trouser|accessory|shoe|footwear|price|\$)/i)) {
      return sentence.trim() + '.';
    }
  }
  
  // If no good sentence found, return the first sentence that's reasonably sized
  for (const sentence of sentences) {
    if (sentence.trim().length > 15 && sentence.trim().length < 100) {
      return sentence.trim() + '.';
    }
  }
  
  return null;
}

// Extract clothing items from text
function extractOutfitItems(text, gender) {
  const items = [];
  
  // Identify potential clothing items by type
  const topPatterns = [
    /([a-z\s]+(?:shirt|blouse|top|sweater|jacket|blazer|tee|hoodie|pullover|cardigan))[^.]*?(\$\s*\d+\.?\d*|\d+\.?\d*\s*\$|^\s*$)/i,
    /(top|upper\s+body|upper\s+half):\s*([^.]*)/i
  ];
  
  const bottomPatterns = [
    /([a-z\s]+(?:jeans|pants|trousers|shorts|skirt|chinos|slacks|leggings))[^.]*?(\$\s*\d+\.?\d*|\d+\.?\d*\s*\$|^\s*$)/i,
    /(bottom|lower\s+body|lower\s+half):\s*([^.]*)/i
  ];
  
  const accessoryPatterns = [
    /([a-z\s]+(?:watch|necklace|bracelet|hat|cap|beanie|scarf|belt|sunglasses|glasses|earrings|ring|jewelry))[^.]*?(\$\s*\d+\.?\d*|\d+\.?\d*\s*\$|^\s*$)/i,
    /(accessory|accessories):\s*([^.]*)/i
  ];
  
  // Look for tops
  for (const pattern of topPatterns) {
    const match = text.match(pattern);
    if (match) {
      const name = (match[1] || match[2]).trim();
      const priceMatch = name.match(/\$\s*(\d+\.?\d*)|(\d+\.?\d*)\s*\$/);
      const price = priceMatch ? parseFloat(priceMatch[1] || priceMatch[2]) : generateRandomPrice('top');
      
      // Only add if we don't already have a top
      if (!items.some(item => item.type === 'top')) {
        items.push({
          type: 'top',
          name: name.replace(/\$\s*\d+\.?\d*|\d+\.?\d*\s*\$/g, '').trim(),
          brand: extractBrand(text) || suggestBrand('top', gender),
          price: price,
          description: `A stylish ${extractStyle(text)} top to pair with your shoes`
        });
      }
    }
  }
  
  // Look for bottoms
  for (const pattern of bottomPatterns) {
    const match = text.match(pattern);
    if (match) {
      const name = (match[1] || match[2]).trim();
      const priceMatch = name.match(/\$\s*(\d+\.?\d*)|(\d+\.?\d*)\s*\$/);
      const price = priceMatch ? parseFloat(priceMatch[1] || priceMatch[2]) : generateRandomPrice('bottom');
      
      // Only add if we don't already have a bottom
      if (!items.some(item => item.type === 'bottom')) {
        items.push({
          type: 'bottom',
          name: name.replace(/\$\s*\d+\.?\d*|\d+\.?\d*\s*\$/g, '').trim(),
          brand: extractBrand(text) || suggestBrand('bottom', gender),
          price: price,
          description: `Perfect ${extractStyle(text)} bottoms to complete your look`
        });
      }
    }
  }
  
  // Look for accessories
  for (const pattern of accessoryPatterns) {
    const match = text.match(pattern);
    if (match) {
      const name = (match[1] || match[2]).trim();
      const priceMatch = name.match(/\$\s*(\d+\.?\d*)|(\d+\.?\d*)\s*\$/);
      const price = priceMatch ? parseFloat(priceMatch[1] || priceMatch[2]) : generateRandomPrice('accessory');
      
      // Only add if we don't already have an accessory
      if (!items.some(item => item.type === 'accessory')) {
        items.push({
          type: 'accessory',
          name: name.replace(/\$\s*\d+\.?\d*|\d+\.?\d*\s*\$/g, '').trim(),
          brand: extractBrand(text) || suggestBrand('accessory', gender),
          price: price,
          description: `Stylish accessory to enhance your outfit`
        });
      }
    }
  }
  
  return items;
}

// Extract brand names from text
function extractBrand(text) {
  // List of common clothing brands
  const commonBrands = [
    'Nike', 'Adidas', 'H&M', 'Zara', 'Levi\'s', 'Gap', 'Calvin Klein', 'Ralph Lauren',
    'Tommy Hilfiger', 'Uniqlo', 'Gucci', 'Prada', 'Versace', 'Balenciaga', 'Fendi',
    'Armani', 'Balmain', 'Burberry', 'Dior', 'Louis Vuitton', 'North Face', 'Patagonia',
    'Columbia', 'Under Armour', 'New Balance', 'Converse', 'Vans', 'Reebok', 'Puma',
    'Urban Outfitters', 'Forever 21', 'American Eagle', 'Hollister', 'Abercrombie'
  ];
  
  // Check if any of the common brands appear in the text
  for (const brand of commonBrands) {
    const regex = new RegExp(`\\b${brand}\\b`, 'i');
    if (regex.test(text)) {
      return brand;
    }
  }
  
  return null;
}

// Suggest a brand based on item type and gender
function suggestBrand(type, gender) {
  const brandsByType = {
    top: {
      Men: ['Nike', 'Ralph Lauren', 'H&M', 'Zara', 'Uniqlo', 'Gap', 'J.Crew'],
      Women: ['Zara', 'H&M', 'Madewell', 'J.Crew', 'Gap', 'Uniqlo', 'Free People'],
      unisex: ['Nike', 'Adidas', 'H&M', 'Uniqlo', 'Gap']
    },
    bottom: {
      Men: ['Levi\'s', 'Dockers', 'Gap', 'H&M', 'Uniqlo', 'Dickies', 'Carhartt'],
      Women: ['Levi\'s', 'Zara', 'H&M', 'Madewell', 'Gap', 'American Eagle', 'Uniqlo'],
      unisex: ['Levi\'s', 'Gap', 'H&M', 'Uniqlo', 'Dickies']
    },
    accessory: {
      Men: ['Fossil', 'Ray-Ban', 'Timex', 'Herschel', 'Nixon', 'Casio', 'Seiko'],
      Women: ['Michael Kors', 'Kate Spade', 'Ray-Ban', 'Madewell', 'Kendra Scott'],
      unisex: ['Ray-Ban', 'Fossil', 'Herschel', 'Casio', 'Timex']
    }
  };
  
  // Use the appropriate gender list or default to unisex
  const genderKey = brandsByType[type][gender] ? gender : 'unisex';
  const brands = brandsByType[type][genderKey];
  
  // Return a random brand from the list
  return brands[Math.floor(Math.random() * brands.length)];
}

// Generate a realistic random price based on item type
function generateRandomPrice(type) {
  const priceRanges = {
    top: { min: 25, max: 65 },
    bottom: { min: 35, max: 85 },
    accessory: { min: 15, max: 50 }
  };
  
  const range = priceRanges[type] || { min: 20, max: 60 };
  return Number((Math.random() * (range.max - range.min) + range.min).toFixed(2));
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
      price: style === 'formal' ? 59.99 : 29.99,
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
      price: style === 'formal' ? 79.99 : 59.99,
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
      price: style === 'formal' ? 89.99 : 35.99,
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
  }
  
  // Fall back to base style if no specific theme was detected
  if (!theme) {
    theme = baseStyle;
    // Keep the style as is
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
  return { 
    outfits: [
      createThematicOutfit(product, "Casual"),
      createThematicOutfit(product, "Business"),
      createThematicOutfit(product, "Elegant")
    ] 
  };
}

module.exports = { generateOutfitRecommendations };