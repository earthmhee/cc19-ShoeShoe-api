const prisma = require("../config/prisma");
const createError = require("../utils/createError");

// Get all orders with filtering, sorting, and pagination (Admin only)
exports.getAllOrders = async (req, res, next) => {
  try {
    // Get user from the request
    const userClerk = req.user;
    
    // Verify the user is an admin
    if (userClerk?.publicMetadata?.role !== "Admin") {
      return next(createError(403, "Unauthorized access. Admin privileges required."));
    }

    // Parse query parameters
    const { 
      status, 
      start_date, 
      end_date, 
      payment_status,
      page = 1,
      limit = 10,
      sortField = 'id',
      sortDirection = 'desc'
    } = req.query;

    // Build the filter object
    const filter = {};
    if (status) {
      filter.shipment_status = status;
    }
    
    if (payment_status) {
      filter.payment_status = payment_status;
    }
    
    if (start_date || end_date) {
      filter.order_date = {};
      
      if (start_date) {
        filter.order_date.gte = new Date(start_date);
      }
      
      if (end_date) {
        // Set the end date to the end of the day
        const endDateObj = new Date(end_date);
        endDateObj.setHours(23, 59, 59, 999);
        filter.order_date.lte = endDateObj;
      }
    }

    // Calculate pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Determine sort order
    const orderBy = {};
    orderBy[sortField === 'customer' ? 'user' : sortField] = sortDirection.toLowerCase();

    // Get total count of orders matching the filter
    const totalCount = await prisma.order.count({
      where: filter
    });

    // Get orders with filters, sorting, and pagination
    const orders = await prisma.order.findMany({
      where: filter,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
            phone: true
          }
        },
        orderItems: {
          include: {
            product: true
          }
        },
        payment: true
      },
      orderBy,
      skip,
      take
    });

    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      order_date: order.order_date.toISOString().split('T')[0],
      total_amount: order.total_amount,
      shipment_status: order.shipment_status,
      payment_status: order.payment_status,
      customer: {
        id: order.user.id,
        name: `${order.user.firstname || ''} ${order.user.lastname || ''}`.trim() || order.user.username,
        email: order.user.email,
        phone: order.user.phone
      },
      items: order.orderItems.map(item => ({
        id: item.id,
        product_name: item.product.productname,
        quantity: item.quantity,
        price: item.price
      }))
    }));

    res.status(200).json({
      msg: "Orders retrieved successfully",
      data: formattedOrders,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    next(error);
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    // Get user from the request
    const userClerk = req.user;
    
    // Verify the user is an admin
    if (userClerk?.publicMetadata?.role !== "Admin") {
      return next(createError(403, "Unauthorized access. Admin privileges required."));
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return next(createError(400, "Order ID and status are required"));
    }

    // Validate status value
    const validStatuses = ["Pending", "Delivered"];
    if (!validStatuses.includes(status)) {
      return next(createError(400, "Invalid status value. Must be 'Pending' or 'Delivered'"));
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order) {
      return next(createError(404, "Order not found"));
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { 
        shipment_status: status,
        updated_at: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      msg: `Order status updated to ${status}`,
      data: {
        id: updatedOrder.id,
        order_date: updatedOrder.order_date.toISOString().split('T')[0],
        shipment_status: updatedOrder.shipment_status,
        payment_status: updatedOrder.payment_status,
        total_amount: updatedOrder.total_amount,
        customer: {
          id: updatedOrder.user.id,
          name: `${updatedOrder.user.firstname || ''} ${updatedOrder.user.lastname || ''}`.trim() || updatedOrder.user.username,
          email: updatedOrder.user.email
        }
      }
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    next(error);
  }
};

// Get order by ID (Admin only)
exports.getOrderById = async (req, res, next) => {
  try {
    // Get user from the request
    const userClerk = req.user;
    
    // Verify the user is an admin
    if (userClerk?.publicMetadata?.role !== "Admin") {
      return next(createError(403, "Unauthorized access. Admin privileges required."));
    }
    
    const { id } = req.params;
    
    if (!id) {
      return next(createError(400, "Order ID is required"));
    }
    
    // Get order details with related data
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
            phone: true,
            address: true
          }
        },
        orderItems: {
          include: {
            product: true
          }
        },
        payment: true
      }
    });
    
    if (!order) {
      return next(createError(404, "Order not found"));
    }
    
    // Format order for response
    const formattedOrder = {
      id: order.id,
      order_date: order.order_date.toISOString().split('T')[0],
      total_amount: order.total_amount,
      shipment_status: order.shipment_status,
      payment_status: order.payment_status,
      customer: {
        id: order.user.id,
        name: `${order.user.firstname || ''} ${order.user.lastname || ''}`.trim() || order.user.username,
        email: order.user.email,
        phone: order.user.phone,
        address: order.user.address
      },
      items: order.orderItems.map(item => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      payment: order.payment ? {
        id: order.payment.id,
        method: order.payment.paymentmethod,
        date: order.payment.payment_date.toISOString().split('T')[0],
        status: order.payment.status,
        amount: order.payment.amount
      } : null
    };
    
    res.status(200).json({
      msg: "Order retrieved successfully",
      data: formattedOrder
    });
  } catch (error) {
    console.error("Error retrieving order:", error);
    next(error);
  }
};

// Search orders (Admin only)
exports.searchOrders = async (req, res, next) => {
  try {
    // Get user from the request
    const userClerk = req.user;
    
    // Verify the user is an admin
    if (userClerk?.publicMetadata?.role !== "Admin") {
      return next(createError(403, "Unauthorized access. Admin privileges required."));
    }

    const { query } = req.query;
    
    if (!query) {
      return next(createError(400, "Search query is required"));
    }

    // Search by order ID (if query is a number)
    const orderId = parseInt(query);
    const isNumeric = !isNaN(orderId);

    const whereClause = isNumeric 
      ? { id: orderId } 
      : {
          OR: [
            {
              user: {
                OR: [
                  { firstname: { contains: query } },
                  { lastname: { contains: query } },
                  { email: { contains: query } },
                  { username: { contains: query } }
                ]
              }
            }
          ]
        };

    // Search orders
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
            phone: true
          }
        },
        orderItems: {
          include: {
            product: true
          }
        },
        payment: true
      },
      take: 20 // Limit results
    });

    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      order_date: order.order_date.toISOString().split('T')[0],
      total_amount: order.total_amount,
      shipment_status: order.shipment_status,
      payment_status: order.payment_status,
      customer: {
        id: order.user.id,
        name: `${order.user.firstname || ''} ${order.user.lastname || ''}`.trim() || order.user.username,
        email: order.user.email,
        phone: order.user.phone
      },
      items: order.orderItems.map(item => ({
        id: item.id,
        product_name: item.product.productname,
        quantity: item.quantity,
        price: item.price
      }))
    }));

    res.status(200).json({
      msg: "Search results",
      data: formattedOrders
    });
  } catch (error) {
    console.error("Error searching orders:", error);
    next(error);
  }
};