const { GoogleGenerativeAI } = require("@google/generative-ai");

// สร้างอินสแตนซ์ของ GoogleGenerativeAI
const genAI = new GoogleGenerativeAI("AIzaSyAZKl-4_HogE7tk1OcEyP9CALNrxR_K2Qg");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generateAIResponse = async (req, res) => {
    try {
        const { prompt } = req.body; // รับข้อความจาก request body
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        // เรียกใช้งาน AI Model
        const result = await model.generateContent(prompt);
        
        // ตรวจสอบโครงสร้างของ Response
        const text = result.response?.candidates?.[0]?.content || "No response from AI";

        return res.json({ response: text });
    } catch (error) {
        console.error("Error generating AI response:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { generateAIResponse };
