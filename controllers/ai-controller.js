// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const { showproduct } = require("../controllers/product-controller");

// const genAI = new GoogleGenerativeAI("AIzaSyAZKl-4_HogE7tk1OcEyP9CALNrxR_K2Qg");
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// const promptOptions = [
//   "ฉันมีงบ 2000 บาท",
//   "ฉันมีงบ 3000 บาท",
//   "ฉันมีงบ 4000 บาท",
//   "ฉันมีงบ 5000 บาท",
//   "ฉันมีงบ 6000 บาท",
//   "อยากได้รองเท้า Nike รุ่นที่นิยม",
//   "ขอแนะนำรองเท้าสำหรับวิ่ง",
//   "ขอแนะนำรองเท้าสำหรับเดินทาง",
//   "ขอแนะนำรองเท้าสำหรับบาสเก็ตบอล",
//   "ขอรองเท้าผู้หญิง",
//   "ขอรองเท้าผู้ชายสำหรับวิ่ง",
// ];

// const generateAIResponse = async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.json({
//         message: "กรุณาเลือกคำถามที่คุณต้องการให้ AI ตอบ",
//         options: promptOptions,
//       });
//     }

//     let products = await showproduct();
//     req.app.set("products", products);

//     console.log(` สินค้าทั้งหมด: ${products.length} รายการ`);

//     const availableBrands = [...new Set(products.map(p => p.brand.toLowerCase().trim()))];
//     console.log(" แบรนด์ในระบบ:", availableBrands);

//     let maxPrice = null;
//     const priceMatch = prompt.match(/(\d{3,6})\s*บาท?/);
//     if (priceMatch) {
//       maxPrice = parseInt(priceMatch[1], 10);
//       console.log(` ค้นหาสินค้าราคาต่ำกว่า ${maxPrice} บาท`);
//     }

//     let genderFilter = null;
//     if (/ผู้หญิง|หญิง|women/i.test(prompt)) {
//       genderFilter = "Women";
//     } else if (/ผู้ชาย|ชาย|men/i.test(prompt)) {
//       genderFilter = "Men";
//     }

//     const matchingBrand = availableBrands.find(brand =>
//       prompt.toLowerCase().replace(/\s+/g, "").includes(brand.replace(/\s+/g, ""))
//     );

//     let matchingProducts = products.filter((p) => {
//       let match = true;
//       if (maxPrice) match = match && p.price <= maxPrice;
//       if (genderFilter) match = match && p.gender.toLowerCase() === genderFilter.toLowerCase();
//       if (matchingBrand) match = match && p.brand.toLowerCase().trim() === matchingBrand;
//       return match;
//     });

//     if (/(วิ่ง|run|ออกกำลังกาย)/i.test(prompt)) {
//       matchingProducts = matchingProducts.filter((p) =>
//         p.productname.toLowerCase().includes("run")
//       );
//     } else if (/(เดินทาง|travel|เดิน|เดินนาน)/i.test(prompt)) {
//       matchingProducts = matchingProducts.filter((p) =>
//         p.productname.toLowerCase().includes("travel")
//       );
//     } else if (/(บาส|basketball|บาสเก็ตบอล)/i.test(prompt)) {
//       matchingProducts = matchingProducts.filter((p) =>
//         p.productname.toLowerCase().includes("basketball")
//       );
//     }

//     console.log(` พบสินค้าที่ตรงเงื่อนไข: ${matchingProducts.length} รายการ`);

//     if (matchingProducts.length === 0) {
//       console.log(" ไม่เจอสินค้าที่ตรงเงื่อนไข → แสดงสินค้าสุ่มแทน");
//       matchingProducts = products.sort(() => 0.5 - Math.random()).slice(0, 5);
//     }

//     if (matchingProducts.length === 0) {
//       return res.json({ response: `ขอโทษครับ 😢 ไม่พบสินค้าที่ตรงกับ "${prompt}"` });
//     }

//     const productList = matchingProducts
//       .slice(0, 5)
//       .map((p) => `- ${p.productname} ราคา ${p.price} บาท`)
//       .join("\n");

//     const aiPrompt = `
//       ลูกค้าต้องการ "${prompt}"  
//       นี่คือรายการสินค้าที่แนะนำ:  
//       ${productList}  
//       กรุณาแนะนำสินค้าที่ดีที่สุดและให้เหตุผลที่เป็นธรรมชาติ
//     `;

//     console.log(" AI Prompt ที่ส่งไป:\n", aiPrompt);

//     const result = await model.generateContent({
//       contents: [{ role: "user", parts: [{ text: aiPrompt }] }],
//     });

//     const aiResponse =
//       result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "ขอโทษครับ ผมไม่สามารถแนะนำรองเท้าได้ตอนนี้ 😔";

//     const formattedResponse = aiResponse
//       .replace(/\*\*/g, "")
//       .replace(/\n{2,}/g, "\n")
//       .replace(/(\d+\.)/g, "•")
//       .split("\n")
//       .slice(0, 5)
//       .join("\n");

//     console.log(" คำตอบจาก AI:\n", formattedResponse);

//     return res.json({ response: formattedResponse });
//   } catch (error) {
//     console.error("เกิดข้อผิดพลาด:", error);
//     return res.status(500).json({ error: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่ภายหลัง" });
//   }
// };

// module.exports = { generateAIResponse };


const { GoogleGenerativeAI } = require("@google/generative-ai");
const { showproduct } = require("../controllers/product-controller");

const genAI = new GoogleGenerativeAI("AIzaSyAZKl-4_HogE7tk1OcEyP9CALNrxR_K2Qg");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const promptOptions = [
  // Complex combinations focusing on gender, brand, activity, price and special features
  "รองเท้าผู้หญิง Nike สำหรับวิ่งมาราธอน งบไม่เกิน 4000 บาท รุ่นล่าสุด",
  "รองเท้าผู้ชาย Adidas กันน้ำ สำหรับเทรคกิ้งและเดินป่า ราคา 3000-5000 บาท",
  "รองเท้าผู้หญิงแบรนด์ใดก็ได้ลดราคา สำหรับใส่ทำงานออฟฟิศและเดินเยอะ งบไม่เกิน 2500 บาท",
  "รองเท้าผู้ชาย New Balance หรือ Asics สำหรับวิ่งระยะไกล น้ำหนักเบา ระบายอากาศดี งบ 4000-6000 บาท",
  "รองเท้าบาสเก็ตบอล Nike หรือ Jordan สำหรับผู้ชายตัวสูง พื้นรองรับแรงกระแทกดี ราคา 4500-7000 บาท",
  "รองเท้าแบรนด์หรู สำหรับผู้หญิงใส่ออกงาน ดีไซน์ทันสมัย สวมใส่สบาย งบ 5000-8000 บาท",
  "รองเท้าผู้ชาย Adidas หรือ Nike ลดราคา ใส่ได้ทั้งทำงานและออกกำลังกาย ราคาไม่เกิน 3500 บาท",
  "รองเท้ากันน้ำสำหรับผู้หญิง เหมาะกับหน้าฝน ใส่เดินทางได้ทั้งวัน ราคาประมาณ 2000-4000 บาท",
  "รองเท้ารุ่นใหม่ล่าสุดสำหรับผู้ชาย ใส่วิ่งและเล่นกีฬา มีเทคโนโลยีล่าสุด งบไม่เกิน 6000 บาท"
];

const generateAIResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({
        message: "กรุณาเลือกคำถามที่คุณต้องการให้ AI ตอบ",
        options: promptOptions,
      });
    }

    let products = await showproduct();
    req.app.set("products", products);

    console.log(` สินค้าทั้งหมด: ${products.length} รายการ`);

    // Extract all available brands for filtering
    const availableBrands = [...new Set(products.map(p => p.brand.toLowerCase().trim()))];
    console.log(" แบรนด์ในระบบ:", availableBrands);

    // Enhanced filters
    // Price range filter - now supports ranges like "3000-5000"
    let minPrice = null;
    let maxPrice = null;
    
    // Match price ranges like "3000-5000" or "3000 ถึง 5000" or "3000 - 5000"
    const priceRangeMatch = prompt.match(/(\d{3,6})\s*[-–—ถึง]\s*(\d{3,6})/);
    if (priceRangeMatch) {
      minPrice = parseInt(priceRangeMatch[1], 10);
      maxPrice = parseInt(priceRangeMatch[2], 10);
      console.log(` ค้นหาสินค้าราคาระหว่าง ${minPrice} - ${maxPrice} บาท`);
    } else {
      // Match single price with "ไม่เกิน" or similar
      const maxPriceMatch = prompt.match(/ไม่เกิน\s*(\d{3,6})|ต่ำกว่า\s*(\d{3,6})|น้อยกว่า\s*(\d{3,6})|ประมาณ\s*(\d{3,6})|ราคา\s*(\d{3,6})|งบ\s*(\d{3,6})|(\d{3,6})\s*บาท/);
      if (maxPriceMatch) {
        // Find the first non-undefined group (the matched price)
        const matchedPrice = maxPriceMatch.slice(1).find(match => match !== undefined);
        maxPrice = parseInt(matchedPrice, 10);
        console.log(` ค้นหาสินค้าราคาไม่เกิน ${maxPrice} บาท`);
      }
    }

    // Enhanced gender filter - more comprehensive matching
    let genderFilter = null;
    if (/ผู้หญิง|หญิง|women|woman|female|สาว/i.test(prompt)) {
      genderFilter = "Women";
    } else if (/ผู้ชาย|ชาย|men|man|male/i.test(prompt)) {
      genderFilter = "Men";
    }

    // Enhanced brand filter - support for multiple brands
    let brandFilters = [];
    availableBrands.forEach(brand => {
      if (prompt.toLowerCase().includes(brand.toLowerCase())) {
        brandFilters.push(brand);
      }
    });

    // Enhanced purpose/activity filter
    let purposeFilters = [];
    const purposes = [
      { keywords: /(วิ่ง|run|marathon|มาราธอน|ออกกำลังกาย|จ๊อกกิ้ง|jogging)/i, tag: "running" },
      { keywords: /(เดินทาง|travel|เที่ยว|ท่องเที่ยว|เดิน|เดินนาน|เดินเที่ยว)/i, tag: "travel" },
      { keywords: /(บาส|basketball|บาสเก็ตบอล)/i, tag: "basketball" },
      { keywords: /(ทำงาน|office|ออฟฟิศ|formal|ทางการ)/i, tag: "work" },
      { keywords: /(เทรคกิ้ง|hiking|ปีนเขา|เดินป่า|trail|outdoor)/i, tag: "hiking" },
      { keywords: /(ยิม|gym|ฟิตเนส|fitness|workout|ออกกำลัง)/i, tag: "gym" },
      { keywords: /(กันน้ำ|waterproof|หน้าฝน|ฝน|rain)/i, tag: "waterproof" }
    ];

    purposes.forEach(purpose => {
      if (purpose.keywords.test(prompt)) {
        purposeFilters.push(purpose.tag);
      }
    });

    // Discount filter
    const isOnSale = /(ลดราคา|sale|โปรโมชั่น|promotion|discount|ส่วนลด)/i.test(prompt);
    
    // New arrival filter
    const isNewArrival = /(ใหม่|new arrival|ล่าสุด|รุ่นใหม่|latest)/i.test(prompt);

    // Apply all filters
    let matchingProducts = products.filter((p) => {
      let match = true;
      
      // Price filter
      if (minPrice && maxPrice) {
        match = match && p.price >= minPrice && p.price <= maxPrice;
      } else if (maxPrice) {
        match = match && p.price <= maxPrice;
      }
      
      // Gender filter
      if (genderFilter) {
        match = match && p.gender.toLowerCase() === genderFilter.toLowerCase();
      }
      
      // Brand filter
      if (brandFilters.length > 0) {
        match = match && brandFilters.some(brand => 
          p.brand.toLowerCase().trim() === brand.toLowerCase()
        );
      }
      
      // Discount filter
      if (isOnSale) {
        match = match && p.discount > 0;
      }
      
      // New arrival filter - assuming newer products have higher IDs or recent created_at dates
      // This is a placeholder logic - adjust based on your actual data structure
      if (isNewArrival) {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        match = match && new Date(p.created_at) > threeMonthsAgo;
      }
      
      return match;
    });

    // Apply purpose filters
    if (purposeFilters.length > 0) {
      matchingProducts = matchingProducts.filter((p) => {
        const productName = p.productname.toLowerCase();
        const productDesc = p.description ? p.description.toLowerCase() : '';
        
        // Match product against each purpose filter
        return purposeFilters.some(purpose => {
          switch (purpose) {
            case "running":
              return /run|วิ่ง|marathon|จ๊อกกิ้ง|jogging/i.test(productName + ' ' + productDesc);
            case "travel":
              return /travel|เดิน|walking|casual/i.test(productName + ' ' + productDesc);
            case "basketball":
              return /basketball|บาส|บาสเก็ตบอล/i.test(productName + ' ' + productDesc);
            case "work":
              return /casual|formal|office|work/i.test(productName + ' ' + productDesc);
            case "hiking":
              return /hiking|trail|outdoor|trek/i.test(productName + ' ' + productDesc);
            case "gym":
              return /training|gym|fitness|workout/i.test(productName + ' ' + productDesc);
            case "waterproof":
              return /waterproof|water|resistant|กันน้ำ/i.test(productName + ' ' + productDesc);
            default:
              return false;
          }
        });
      });
    }

    console.log(` พบสินค้าที่ตรงเงื่อนไข: ${matchingProducts.length} รายการ`);

    // Fallback if no products match the criteria
    if (matchingProducts.length === 0) {
      console.log(" ไม่เจอสินค้าที่ตรงเงื่อนไข → แสดงสินค้าที่ใกล้เคียงแทน");
      
      // Try relaxing filters one by one
      // 1. Try relaxing purpose filters
      if (purposeFilters.length > 0) {
        matchingProducts = products.filter((p) => {
          let match = true;
          if (minPrice && maxPrice) match = match && p.price >= minPrice && p.price <= maxPrice;
          else if (maxPrice) match = match && p.price <= maxPrice;
          if (genderFilter) match = match && p.gender.toLowerCase() === genderFilter.toLowerCase();
          if (brandFilters.length > 0) {
            match = match && brandFilters.some(brand => p.brand.toLowerCase().trim() === brand.toLowerCase());
          }
          return match;
        });
      }
      
      // 2. If still no matches, try relaxing brand filters
      if (matchingProducts.length === 0 && brandFilters.length > 0) {
        matchingProducts = products.filter((p) => {
          let match = true;
          if (minPrice && maxPrice) match = match && p.price >= minPrice && p.price <= maxPrice;
          else if (maxPrice) match = match && p.price <= maxPrice;
          if (genderFilter) match = match && p.gender.toLowerCase() === genderFilter.toLowerCase();
          return match;
        });
      }
      
      // 3. If still no matches, try relaxing price filter but keep gender filter
      if (matchingProducts.length === 0 && genderFilter) {
        matchingProducts = products.filter((p) => {
          return p.gender.toLowerCase() === genderFilter.toLowerCase();
        });
      }

      // 4. Last resort - show random products
      if (matchingProducts.length === 0) {
        matchingProducts = products.sort(() => 0.5 - Math.random()).slice(0, 5);
      }
    }

    // Ensure we have at least one product to recommend
    if (matchingProducts.length === 0) {
      return res.json({ response: `ขอโทษครับ 😢 ไม่พบสินค้าที่ตรงกับ "${prompt}"` });
    }

    // Get the top matching products
    const topProducts = matchingProducts.slice(0, 5);
    
    // Create the product list for the AI prompt with numbered items for clear reference
    const productList = topProducts
      .map((p, index) => {
        const discountInfo = p.discount > 0 
          ? ` (ลด ${p.discount < 1 ? Math.round(p.discount * 100) : p.discount}%)` 
          : '';
        return `${index + 1}. ${p.productname} ราคา ${p.price} บาท${discountInfo} - ${p.brand} (${p.gender})`;
      })
      .join("\n");

    const aiPrompt = `
      ลูกค้าต้องการ "${prompt}"  
      นี่คือรายการสินค้าที่แนะนำ:  
      ${productList}  
      
      กรุณาแนะนำสินค้าที่ดีที่สุดสำหรับความต้องการของลูกค้า และให้เหตุผลที่เหมาะสม เช่น:
      - หากเป็นรองเท้าวิ่ง ให้อธิบายว่าเหมาะกับการวิ่งอย่างไร
      - หากเป็นรองเท้าทำงาน ให้อธิบายว่าเหมาะกับการใส่ทำงานอย่างไร
      - อธิบายจุดเด่นของรองเท้าแต่ละคู่
      
      สำคัญ: เมื่อกล่าวถึงสินค้า ให้ระบุชื่อเต็มของสินค้าในคำตอบ เช่น "ฉันขอแนะนำ Nike Air Max 270" ถ้านี่คือชื่อสินค้าในรายการ
    `;

    console.log(" AI Prompt ที่ส่งไป:\n", aiPrompt);

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: aiPrompt }] }],
    });

    const aiResponse =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "ขอโทษครับ ผมไม่สามารถแนะนำรองเท้าได้ตอนนี้ 😔";

    const formattedResponse = aiResponse
      .replace(/\*\*/g, "")
      .replace(/\n{2,}/g, "\n")
      .replace(/(\d+\.)/g, "•")
      .split("\n")
      .slice(0, 8) // Allow for slightly longer responses
      .join("\n");

    console.log(" คำตอบจาก AI:\n", formattedResponse);

    // Prepare structured product data for linking in the frontend
    const recommendedProducts = topProducts.map(p => ({
      id: p.id,
      name: p.productname,
      price: p.price,
      brand: p.brand,
      gender: p.gender,
      discount: p.discount,
      // Extract first image if available
      image: p.images ? 
        (typeof p.images === 'string' ? 
          JSON.parse(p.images)[0] : 
          p.images[0]) : 
        null
    }));

    // Return both the AI response text and the structured product data
    return res.json({ 
      response: formattedResponse, 
      products: recommendedProducts 
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่ภายหลัง" });
  }
};

module.exports = { generateAIResponse };


