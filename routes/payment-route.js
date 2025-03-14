const express = require("express");
const paymentController = require("../controllers/payment-controller");
const paymentRoute = express.Router();

paymentRoute.post("/checkout", paymentController.checkout);
paymentRoute.post("/checkout-status/:session_id", paymentController.checkOutStatus);

module.exports = paymentRoute;
