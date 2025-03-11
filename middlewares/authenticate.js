const createError = require("../utils/createError");
const { clerkClient } = require("@clerk/express");

module.exports = async (req, res, next) => {
  try {
    //Token (req.body) need userdata from CLERK
    const clerkID = req.auth.userId;

    if (!clerkID) {
      return createError(401, "Unauthorized!");
    }

    //get user data from Clerk
    const userClerk = await clerkClient.users.getUser(clerkID);

    //assign in req.user
    req.user = userClerk;

    // send to controller after next
    next();
  } catch (error) {
    next(error);
  }
};
