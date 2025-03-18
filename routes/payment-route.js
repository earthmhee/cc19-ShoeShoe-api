const express = require("express");
const {
	checkout,
	checkOutStatus,
} = require("../controllers/payment-controller");
const paymentRoute = express.Router();

paymentRoute.post("/checkout/:id", checkout);
paymentRoute.post("/checkout-status/:session_id", checkOutStatus);

module.exports = paymentRoute;
