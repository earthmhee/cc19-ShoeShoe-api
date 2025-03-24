const prisma = require("../config/prisma");
const { subscribe } = require("../routes/user-route");
const createError = require("../utils/createError");

exports.placeOrder = async (req, res, next) => {
  try {
    if (
      !user_id ||
      !orderItems ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0 ||
      !addressId
    ) {
      return res.status(400).json({
        msg: "Invalid order data. Please provide user_id, orderItems array, and total_amount",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(user_id) },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const address = await prisma.address.findFirst({
      where: {
        id: parseInt(addressId),
        userId: parseInt(user_id),
      },
    });

    if (!address) {
      return res
        .status(404)
        .json({ msg: "Address not found or does not belong to the user" });
    }

    const newOrder = await prisma.$transaction(async (prisma) => {
      const total_amount = orderItems.reduce((total, item) => {
        return total + item.discountedPrice * item.quantity;
      }, 0);

      const order = await prisma.order.create({
        data: {
          user_id: parseInt(user_id),
          total_amount: parseInt(total_amount) || 0,
          shipment_status: "Pending",
          payment_status: "Unpaid",
        },
      });

      for (const item of orderItems) {
        await prisma.order_Item.create({
          data: {
            order_id: order.id,
            product_id: parseInt(item.product_id),
            quantity: parseInt(item.quantity),
            price: parseInt(item.discountedPrice),
          },
        });
      }

      return order;
    });

    const orderWithAddress = {
      ...newOrder,
      shipping_address: {
        id: address.id,
        homenum: address.homenum,
        firstname: address.firstname,
        lastname: address.lastname,
        subdistrict: address.subdistrict,
        district: address.district,
        province: address.province,
        country: address.country,
        phone: address.phone,
        postcode: address.postcode,
      },
    };

    res.status(201).json({
      msg: "Order placed successfully",
      data: orderWithAddress,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    next(error);
  }
};

exports.viewOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: {
          orderItems: {
            include: {
              product: true,
            },
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
            },
          },
          address: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              phone: true,
              homenum: true,
              subdistrict: true,
              district: true,
              province: true,
              country: true,
              postcode: true,
            },
          },
        },
      });
      console.log(order);

      if (!order) {
        return res.status(404).json({ msg: "Order not found" });
      }

      res.status(200).json({
        msg: "Order retrieved successfully",
        data: order,
      });
    } else {
      const clerk_id = req.user?.id;
      const user = await prisma.user.findUnique({
        where: { clerkID: clerk_id },
      });

      if (!user) {
        return res.status(401).json({ msg: "User not authenticated" });
      }

      const user_id = user.id;

      const userAddresses = await prisma.address.findMany({
        where: { userId: user_id },
      });

      const orders = await prisma.order.findMany({
        where: { user_id: user_id },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          payment: true,
        },
        orderBy: {
          order_date: "desc",
        },
      });

      res.status(200).json({
        msg: "User orders retrieved successfully",
        data: {
          orders: orders,
          addresses: userAddresses,
        },
      });
    }
  } catch (error) {
    console.error("Error retrieving orders:", error);
    next(error);
  }
};
exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Order ID is required" });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (
      order.shipment_status !== "Pending" ||
      order.payment_status !== "Unpaid"
    ) {
      return res.status(400).json({
        msg: "Cannot delete order. Only pending and unpaid orders can be deleted",
      });
    }

    const item = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        orderItems: true,
      },
    });
    if (!item || !item.orderItems || item.orderItems.length === 0) {
      throw new Error("Order or orderItems not found");
    }

    for (const orderItem of item.orderItems) {
      const stockItem = await prisma.stock.findFirst({
        where: {
          product_id: orderItem.product_id,
          size_id: orderItem.size_id,
        },
      });

      if (!stockItem) {
        throw new Error(
          `Stock not found for product_id: ${orderItem.product_id}, size_id: ${orderItem.size_id}`
        );
      }

      await prisma.stock.update({
        where: { id: stockItem.id },
        data: {
          stock_quantity: stockItem.stock_quantity + orderItem.quantity,
        },
      });
    }

    await prisma.order.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      msg: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    next(error);
  }
};
