const express = require("express");
const authenticate = require("../middlewares/authenticate")
const { checkout, checkOutStatus } = require("../controllers/payment-controller");
const paymentRoute = express.Router();

paymentRoute.post("/checkout/:id", authenticate, checkout);
paymentRoute.post("/checkout-status/:session_id", authenticate, checkOutStatus);

module.exports = paymentRoute;
