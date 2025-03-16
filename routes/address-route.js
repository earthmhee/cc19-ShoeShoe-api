const express = require("express");
const authenticate = require("../middlewares/authenticate");
const { createAddress, getAddress, updateAddress, deleteAddress } = require("../controllers/address-controller");
const addressRoute = express.Router();

addressRoute.post("/", authenticate, createAddress);

addressRoute.get("/", authenticate, getAddress);

addressRoute.patch("/:id", authenticate, updateAddress);

addressRoute.delete("/:id", authenticate, deleteAddress);

module.exports = addressRoute