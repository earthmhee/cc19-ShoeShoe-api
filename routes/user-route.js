const express = require("express");
const {
	createUpdateAccount,
	createNewAccount,
	changePassword,
} = require("../controllers/user-controller");
const authenticate = require("../middlewares/authenticate");
const userRoute = express.Router();

userRoute.get("/my-account", authenticate, createNewAccount);
userRoute.put("/update-account", authenticate, createUpdateAccount);
userRoute.put("/change-password", authenticate, changePassword);

module.exports = userRoute;
