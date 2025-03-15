const { default: clerkClient } = require("@clerk/clerk-sdk-node");
const prisma = require("../config/prisma");
const createError = require("../utils/createError");

exports.createNewAccount = async (req, res, next) => {
	try {
		const { id } = req.user;
		const userClerk = req.user;
		const userId = userClerk.id;
		console.log("User Id : ", id);
		// look for user
		const rs = await prisma.user.findUnique({
			where: {
				clerkID: id,
			},
		});
		// const role = "Customer"
		// หากเป็น null (สร้าง user ครั้งแรก) ทำการสร้างผู้ใช้ใน prisma
		if (rs === null) {
			const result = await prisma.user.create({
				data: {
					clerkID: userClerk?.id,
					username: userClerk?.username,
					firstname: userClerk?.firstName,
					lastname: userClerk?.lastName,
					email: userClerk?.emailAddresses?.[0]?.emailAddress,
					phone: userClerk?.phoneNumbers?.[0]?.phoneNumber,
					password: "Dummy",
					role: userClerk?.publicMetadata?.role || "Customer",
				},
			});
			// ดัน Metadata ไปที่ Clerk
			await clerkClient.users.updateUserMetadata(userId, {
				publicMetadata: {
					role: "Customer",
				},
			});
		}

		res.status(200).json({ msg: "My account create", rs });
	} catch (error) {
		next(error);
	}
};

// dummy for now
exports.createUpdateAccount = async (req, res, next) => {
	try {
		const { firstName, lastName } = req.body; // config for every input
		const input = { firstName, lastName };
		console.log(input);

		const userClerk = req.user;
		const userId = userClerk.id;

		// check if Admin
		const userRole = userClerk?.publicMetadata?.role;
		// if (userRole !== "Admin") {
		// 	createError(401, "Unauthorized !!");
		// }
		// update in Clerk Database
		const rs = await clerkClient.users.updateUser(userId, input);
		// update in mySql Database
		const result = await prisma.user.update({
			where: { clerkID: userId },
			data: {
				firstname: firstName,
				lastname: lastName,
				role: userRole,
			},
		});

		res.status(200).json({ msg: "Create Update", rs });
	} catch (error) {
		next(error);
	}
};

/////////////////////////////////add

// New endpoint for changing password
exports.changePassword = async (req, res, next) => {
	try {
		const { newPassword, confirmPassword, signOutOtherDevices } = req.body;
		const userClerk = req.user;
		const userId = userClerk.id;

		if (newPassword !== confirmPassword) {
			return createError(400, "Passwords do not match");
		}

		// Update password in Clerk
		await clerkClient.users.updateUser(userId, {
			password: newPassword,
		});

		res.status(200).json({ msg: "Password changed successfully" });
	} catch (error) {
		console.error("Change password error:", error);
		next(error);
	}
};
