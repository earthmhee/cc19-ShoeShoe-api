const { GoogleGenerativeAI } = require("@google/generative-ai");
const { showproduct } = require("../controllers/product-controller");

const genAI = new GoogleGenerativeAI("AIzaSyAZKl-4_HogE7tk1OcEyP9CALNrxR_K2Qg");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const promptOptions = [
  "ฉันมีงบ 2000 บาท",
  "ฉันมีงบ 3000 บาท",
  "ฉันมีงบ 4000 บาท",
  "ฉันมีงบ 5000 บาท",
  "ฉันมีงบ 6000 บาท",
  "อยากได้รองเท้า Nike รุ่นที่นิยม",
  "ขอแนะนำรองเท้าสำหรับวิ่ง",
  "ขอแนะนำรองเท้าสำหรับเดินทาง",
  "ขอแนะนำรองเท้าสำหรับบาสเก็ตบอล",
  "ขอรองเท้าผู้หญิง",
  "ขอรองเท้าผู้ชายสำหรับวิ่ง",
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

    const availableBrands = [...new Set(products.map(p => p.brand.toLowerCase().trim()))];
    console.log(" แบรนด์ในระบบ:", availableBrands);

    let maxPrice = null;
    const priceMatch = prompt.match(/(\d{3,6})\s*บาท?/);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1], 10);
      console.log(` ค้นหาสินค้าราคาต่ำกว่า ${maxPrice} บาท`);
    }

    let genderFilter = null;
    if (/ผู้หญิง|หญิง|women/i.test(prompt)) {
      genderFilter = "Women";
    } else if (/ผู้ชาย|ชาย|men/i.test(prompt)) {
      genderFilter = "Men";
    }

    const matchingBrand = availableBrands.find(brand =>
      prompt.toLowerCase().replace(/\s+/g, "").includes(brand.replace(/\s+/g, ""))
    );

    let matchingProducts = products.filter((p) => {
      let match = true;
      if (maxPrice) match = match && p.price <= maxPrice;
      if (genderFilter) match = match && p.gender.toLowerCase() === genderFilter.toLowerCase();
      if (matchingBrand) match = match && p.brand.toLowerCase().trim() === matchingBrand;
      return match;
    });

    if (/(วิ่ง|run|ออกกำลังกาย)/i.test(prompt)) {
      matchingProducts = matchingProducts.filter((p) =>
        p.productname.toLowerCase().includes("run")
      );
    } else if (/(เดินทาง|travel|เดิน|เดินนาน)/i.test(prompt)) {
      matchingProducts = matchingProducts.filter((p) =>
        p.productname.toLowerCase().includes("travel")
      );
    } else if (/(บาส|basketball|บาสเก็ตบอล)/i.test(prompt)) {
      matchingProducts = matchingProducts.filter((p) =>
        p.productname.toLowerCase().includes("basketball")
      );
    }

    console.log(` พบสินค้าที่ตรงเงื่อนไข: ${matchingProducts.length} รายการ`);

    if (matchingProducts.length === 0) {
      console.log(" ไม่เจอสินค้าที่ตรงเงื่อนไข → แสดงสินค้าสุ่มแทน");
      matchingProducts = products.sort(() => 0.5 - Math.random()).slice(0, 5);
    }

    if (matchingProducts.length === 0) {
      return res.json({ response: `ขอโทษครับ 😢 ไม่พบสินค้าที่ตรงกับ "${prompt}"` });
    }

    const productList = matchingProducts
      .slice(0, 5)
      .map((p) => `- ${p.productname} ราคา ${p.price} บาท`)
      .join("\n");

    const aiPrompt = `
      ลูกค้าต้องการ "${prompt}"  
      นี่คือรายการสินค้าที่แนะนำ:  
      ${productList}  
      กรุณาแนะนำสินค้าที่ดีที่สุดและให้เหตุผลที่เป็นธรรมชาติ
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
      .slice(0, 5)
      .join("\n");

    console.log(" คำตอบจาก AI:\n", formattedResponse);

    return res.json({ response: formattedResponse });
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่ภายหลัง" });
  }
};

module.exports = { generateAIResponse };
