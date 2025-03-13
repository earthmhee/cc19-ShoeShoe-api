const createError = require("../utils/createError");
const prisma = require("../config/prisma");

exports.getMyAccount = async (req, res, next) => {
  try {
    const { id } = req.user;
    console.log("User Id : ", id);
    // look for user
    const rs = await prisma.user.findUnique({
      where: {
        clerkID: id,
      },
    });
    const userClerk = req.user;
    console.log(userClerk);

    if (rs === null) {
      const result = await prisma.user.create({
        data : {
            clerkID: userClerk?.id,
            username: userClerk?.username,
            firstname: userClerk?.firstName,
            lastname: userClerk?.lastName,
            email: userClerk?.emailAddresses?.[0]?.emailAddress,
            phone: userClerk?.phoneNumbers?.[0]?.phoneNumber,
            password: 'Dummy',
            role: userClerk?.publicMetadata?.role || 'Customer'
        }
      })
      console.log(result);
    }

    res.status(200).json({ msg: "My account get", rs});
  } catch (error) {
    next(error);
  }
};

// dummy for now
exports.createUpdateAccount = async (req, res, next) => {
  try {
    console.log("Dummy for update");
    const rs = await "Updated";
    res.status(200).json({ msg: "Create Update", rs });
  } catch (error) {
    next(error);
  }
};
