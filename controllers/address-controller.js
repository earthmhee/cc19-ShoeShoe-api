const prisma = require("../config/prisma");

exports.createAddress = async (req, res, next) => {
	try {
		const { homenum, subdistrict, district, province, country, postcode } =
			req.body;
		const clerkID = req.auth.userId;

		console.log(req.auth);

		console.log("Request received with Clerk ID:", clerkID);

		if (!clerkID) {
			return res.status(401).json({ msg: "Unauthorized! Please log in." });
		}

		// Find user by clerkID
		const user = await prisma.user.findFirst({
			where: { clerkID },
		});

		if (!user) {
			return res.status(404).json({ msg: "User account not found." });
		}

		const newAddress = await prisma.address.create({
			data: {
				homenum,
				subdistrict,
				district,
				province,
				phone,
				country,
				postcode: parseInt(postcode),
				userId: user.id,
			},
		});

		res.status(201).json({
			msg: "Address successfully created.",
			address: newAddress,
		});
	} catch (error) {
		console.error("Error:", error);
		next(error);
	}
};

// Retrieve user's addresses
exports.getAddress = async (req, res, next) => {
	try {
		const clerkID = req.auth.userId;

		if (!clerkID) {
			return res.status(401).json({ msg: "Unauthorized! Please log in." });
		}

		console.log("Request received at /get-address with Clerk ID:", clerkID);

		// Find user
		const user = await prisma.user.findUnique({
			where: { clerkID },
			include: { address: true },
		});

		if (!user || !user.address.length) {
			return res.status(404).json({ msg: "No addresses found for this user." });
		}

		res.status(200).json({
			msg: "Addresses retrieved successfully.",
			addresses: user.address,
		});
	} catch (error) {
		console.error("Error:", error);
		next(error);
	}
};

// Update address
exports.updateAddress = async (req, res, next) => {
	try {
		const clerkID = req.auth.userId;
		const { id } = req.params;
		const updateData = req.body;

		if (!clerkID) {
			return res.status(401).json({ msg: "Unauthorized! Please log in." });
		}

		console.log("Request received at /update-address with Clerk ID:", clerkID);

		// Find user
		const user = await prisma.user.findUnique({
			where: { clerkID },
		});

		if (!user) return res.status(404).json({ msg: "User account not found." });

		// Find address
		const address = await prisma.address.findUnique({
			where: { id: parseInt(id) },
		});

		if (!address) {
			return res.status(404).json({ msg: "Address not found." });
		}

		if (address.userId !== user.id) {
			return res
				.status(403)
				.json({ msg: "You do not have permission to update this address." });
		}

		const updatedAddress = await prisma.address.update({
			where: { id: address.id },
			data: { ...updateData },
		});

		res.status(200).json({
			msg: "Address successfully updated.",
			address: updatedAddress,
		});
	} catch (error) {
		console.error("Error:", error);
		next(error);
	}
};

// Delete address
exports.deleteAddress = async (req, res, next) => {
	try {
		const clerkID = req.auth.userId;
		const { id } = req.params;

		if (!clerkID) {
			return res.status(401).json({ msg: "Unauthorized! Please log in." });
		}

		console.log("Request received at /delete-address with Clerk ID:", clerkID);
		console.log("Address ID to delete:", id);

		// Find user
		const user = await prisma.user.findUnique({ where: { clerkID } });

		if (!user) {
			console.log("User not found for Clerk ID:", clerkID);
			return res.status(404).json({ msg: "User account not found." });
		}

		// Validate ID
		const addressID = parseInt(id);
		if (isNaN(addressID)) {
			return res.status(400).json({ msg: "Invalid address ID." });
		}

		// Find address
		const address = await prisma.address.findUnique({
			where: { id: addressID },
		});

		if (!address) {
			console.log("Address not found with ID:", addressID);
			return res.status(404).json({ msg: "Address not found." });
		}

		if (address.userId !== user.id) {
			console.log("Address does not belong to user:", user.id);
			return res
				.status(403)
				.json({ msg: "You do not have permission to delete this address." });
		}

		// Delete address
		await prisma.address.delete({
			where: { id: addressID },
			// where: { id: address.id },
		});

		console.log("Address deleted successfully:", addressID);
		res.status(200).json({ msg: "Address successfully deleted." });
	} catch (error) {
		console.error("Error while deleting address:", error);
		next(error);
	}
};
