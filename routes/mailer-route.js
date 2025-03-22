const express = require("express");
const { orderConfirmation } = require("../controllers/mailer-controller");
const authenticate = require("../middlewares/authenticate");
const mailerRoute = express.Router();

// order confirmation route
mailerRoute.post("/send-order-confirmation", authenticate, orderConfirmation);

module.exports = mailerRoute;
