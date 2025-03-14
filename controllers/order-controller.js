const prisma = require("../config/prisma");
const createError = require("../utils/createError");

// Place order (Feature ID: 18)
exports.placeOrder = async (req, res, next) => {
  try {
    const { user_id, orderItems, total_amount } = req.body;

    // Validate request body
    if (!user_id || !orderItems || !Array.isArray(orderItems) || orderItems.length === 0 || !total_amount) {
      return res.status(400).json({ msg: "Invalid order data. Please provide user_id, orderItems array, and total_amount" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(user_id) }
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Create order with order items in a transaction
    const newOrder = await prisma.$transaction(async (prisma) => {
      // Create order
      const order = await prisma.order.create({
        data: {
          user_id: parseInt(user_id),
          total_amount: parseInt(total_amount),
          shipment_status: "Pending",
          payment_status: "Unpaid"
        }
      });

      // Create order items
      for (const item of orderItems) {
        await prisma.order_Item.create({
          data: {
            order_id: order.id,
            product_id: parseInt(item.product_id),
            quantity: parseInt(item.quantity),
            price: parseInt(item.price)
          }
        });
      }

      return order;
    });

    res.status(201).json({
      msg: "Order placed successfully",
      data: newOrder
    });
  } catch (error) {
    console.error("Order placement error:", error);
    next(error);
  }
};

// View order (Feature ID: 20)
exports.viewOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (id) {
      // Get specific order
      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          payment: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              firstname: true,
              lastname: true,
              phone: true,
              address: true
            }
          }
        }
      });

      if (!order) {
        return res.status(404).json({ msg: "Order not found" });
      }

      res.status(200).json({
        msg: "Order retrieved successfully",
        data: order
      });
    } else {
      // Get all orders for authenticated user
      const user_id = req.user?.id;
      
      if (!user_id) {
        return res.status(401).json({ msg: "User not authenticated" });
      }

      const orders = await prisma.order.findMany({
        where: { user_id: parseInt(user_id) },
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          payment: true
        },
        orderBy: {
          order_date: 'desc'
        }
      });

      res.status(200).json({
        msg: "User orders retrieved successfully",
        data: orders
      });
    }
  } catch (error) {
    console.error("Error retrieving orders:", error);
    next(error);
  }
};

// Delete order (Feature ID: 19)
exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Order ID is required" });
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Only allow deletion if order is in 'Pending' state and 'Unpaid'
    if (order.shipment_status !== "Pending" || order.payment_status !== "Unpaid") {
      return res.status(400).json({ 
        msg: "Cannot delete order. Only pending and unpaid orders can be deleted" 
      });
    }

    // Delete order (cascade deletion will handle order items)
    await prisma.order.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      msg: "Order deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    next(error);
  }
};