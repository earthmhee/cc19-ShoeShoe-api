const { default: clerkClient } = require("@clerk/clerk-sdk-node");
const prisma = require("../config/prisma");
const createError = require("../utils/createError");

exports.createNewAccount = async (req, res, next) => {
	try {
		const { id } = req.user;
		const userClerk = req.user;
		const userId = userClerk.id;
		const userRole = userClerk?.publicMetadata?.role
		console.log("User Id : ", id);
		// look for user
		const rs = await prisma.user.findUnique({
			where: {
				clerkID: id,
			},
		});
		// const role = "Customer"
		// หากเป็น null (สร้าง user ครั้งแรก) ทำการสร้างผู้ใช้ใน prisma
		console.log(rs)
		if (rs === null) {
			const result = await prisma.user.create({
				data: {
					clerkID: userClerk?.id,
					username: userClerk?.username,
					firstname: userClerk?.firstName,
					lastname: userClerk?.lastName,
					email: userClerk?.emailAddresses?.[0]?.emailAddress,
					phone: userClerk?.phoneNumbers?.[0]?.phoneNumber,
					role: userClerk?.publicMetadata?.role || "Customer",
				},
			});
			// ดัน Metadata ไปที่ Clerk
			if (userRole !== 'Admin') {
				await clerkClient.users.updateUserMetadata(userId, {
					publicMetadata: {
						role: "Customer",
					},
				});
			}
		}
		const userRoleDB = await prisma.user.findUnique({
			where: {
				clerkID: id
			}
		})
		if (userRole !== userRoleDB.role){
			const result = await prisma.user.update({
				where: {
					clerkID: id
				},
				data: {
					role: userRole
				}
			})
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

// Add these functions to controllers/user-controller.js

// Get all users
exports.getUsers = async (req, res, next) => {
	try {
	  
	  // Fetch all users with related data needed for the admin panel
	  const users = await prisma.user.findMany({
		select: {
		  id: true,
		  username: true,
		  firstname: true,
		  lastname: true,
		  email: true,
		  phone: true,
		  role: true,
		  clerkID: true, // Include clerkID for reference
		  // Get address info
		  address: {
			select: {
			  id: true,
			  homenum: true,
			  subdistrict: true,
			  district: true,
			  province: true,
			  country: true,
			  postcode: true,
			  phone: true
			}
		  },
		  // Get orders for counting and calculating total spent
		  orders: {
			select: {
			  id: true,
			  total_amount: true,
			  order_date: true,
			  status: true,
			  payment_status: true
			}
		  }
		},
		orderBy: {
		  id: 'asc'
		}
	  });
  
	  // Transform the data to include calculated fields
	  const formattedUsers = users.map(user => {
		// Get completed orders (paid orders)
		const completedOrders = user.orders.filter(order => 
		  order.payment_status === 'Paid'
		);
		
		// Calculate total spent from completed orders
		const totalSpent = completedOrders.reduce((sum, order) => 
		  sum + order.total_amount, 0
		);
		
		return {
		  id: user.id,
		  name: `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.username,
		  email: user.email,
		  phone: user.phone || 'N/A',
		  registrationDate: new Date(user.orders[0]?.order_date || new Date()).toISOString().split('T')[0],
		  ordersCount: user.orders.length,
		  totalSpent: totalSpent,
		  role: user.role,
		  // Include additional details that might be useful
		  username: user.username,
		  address: user.address,
		  // Include only the IDs of orders for reference
		  orderIds: user.orders.map(order => order.id)
		};
	  });
  
	  res.status(200).json({
		status: 'success',
		data: formattedUsers
	  });
	} catch (error) {
	  console.error("Error fetching users:", error);
	  next(error);
	}
  };
  
  // Get user by ID
exports.getUserById = async (req, res, next) => {
	try {
	  const { id } = req.params;
	  
	  if (!id) {
		return res.status(400).json({ 
		  status: 'error', 
		  message: 'User ID is required' 
		});
	  }
	  
	  // Convert id to integer
	  const userId = parseInt(id);
	  if (isNaN(userId)) {
		return res.status(400).json({ 
		  status: 'error', 
		  message: 'Invalid user ID format' 
		});
	  }
	  
	  // Check if user has permission
	  const requestingUserRole = req.user?.publicMetadata?.role;
	  const requestingUserId = req.user?.id;
	  
	  // Optional: Only allow admins or the user themselves to access user details
	  // if (requestingUserRole !== "Admin" && requestingUserId !== id) {
	  //   return next(createError(403, "Unauthorized: You can only access your own data"));
	  // }
	  
	  // Fetch user by ID
	  const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
		  id: true,
		  username: true,
		  firstname: true,
		  lastname: true,
		  email: true,
		  phone: true,
		  role: true,
		  // Exclude sensitive data
		  address: {
			select: {
			  id: true,
			  homenum: true,
			  subdistrict: true,
			  district: true,
			  province: true,
			  country: true,
			  postcode: true,
			  phone: true
			}
		  },
		  orders: {
			select: {
			  id: true,
			  order_date: true,
			  total_amount: true,
			  status: true,
			  shipment_status: true,
			  payment_status: true
			},
			orderBy: {
			  order_date: 'desc'
			}
		  },
		  cart: {
			select: {
			  id: true,
			  cartItems: {
				select: {
				  id: true,
				  quantity: true,
				  product: {
					select: {
					  id: true, 
					  productname: true,
					  price: true,
					  discount: true,
					  images: true
					}
				  },
				  Size: {
					select: {
					  id: true,
					  us_size: true,
					  gender: true
					}
				  }
				}
			  }
			}
		  }
		}
	  });
	  
	  if (!user) {
		return res.status(404).json({
		  status: 'error',
		  message: 'User not found'
		});
	  }
	  
	  res.status(200).json({
		status: 'success',
		data: user
	  });
	} catch (error) {
	  console.error(`Error fetching user:`, error);
	  next(error);
	}
  };
