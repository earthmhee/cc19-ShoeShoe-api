const express = require("express");
// const authenticate = require("../middlewares/authenticate");
const { createAddress, getAddress, updateAddress, deleteAddress } = require("../controllers/address-controller");
const addressRoute = express.Router();

addressRoute.post("/", createAddress);

addressRoute.get("/", getAddress);

addressRoute.patch("/:id", updateAddress);

addressRoute.delete("/:id", deleteAddress);

module.exports = addressRoute