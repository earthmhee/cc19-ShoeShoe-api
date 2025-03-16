const createError = require("../utils/createError");
const { clerkClient } = require("@clerk/express");

module.exports = async (req, res, next) => {
	try {
		// Extract Clerk User ID
		const clerkID = req.auth.userId;
		console.log("clerk id : ", clerkID);

		if (!clerkID) {
			return next(createError(401, "Unauthorized! 55555555"));
		}

		// Fetch user details from Clerk
		const userClerk = await clerkClient.users.getUser(clerkID);

		// Attach user data to the request object
		req.user = userClerk;

		// Proceed to the next middleware/controller
		next();
	} catch (error) {
		next(error);
	}
};
