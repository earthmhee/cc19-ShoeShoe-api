const express = require("express");
const { generateAIResponse } = require("../controllers/ai-controller");

const aiRoute = express.Router();

aiRoute.post("/search", generateAIResponse);

module.exports = aiRoute;
