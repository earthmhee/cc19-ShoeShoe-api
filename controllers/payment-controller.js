const prisma = require("../config/prisma");
const createError = require("../utils/createError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.checkout = async (req, res, next) => {
  try {
    const { id } = req.body;

    // ค้นหา Order พร้อมรายการสินค้า
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        orderItems: {
          include: {
            product: true, // ดึงข้อมูลสินค้าใน Order_Item
          },
        },
      },
    });

    if (!order) {
      return next(createError(404, "Order Not Found"));
    }

    const { total_amount, orderItems } = order;

    // แปลงข้อมูลสินค้าจาก Order_Item ไปเป็น Line Items ของ Stripe
    const line_items = orderItems.map((item) => ({
      price_data: {
        currency: "thb", // ใช้สกุลเงินไทย
        product_data: {
          name: item.product.productname,
          images: [item.product.images], // ใช้รูปจากสินค้า
          description: "ขอบคุณที่สั่งซื้อสินค้าจากร้านเรา",
        },
        unit_amount: item.price * 100, // Stripe ใช้หน่วยสตางค์
      },
      quantity: item.quantity,
    }));

    // สร้าง Stripe Checkout Session และส่ง orderId ไปใน metadata
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: { orderId: order.id }, // บันทึก orderId ไว้ใน metadata
      line_items,
      mode: "payment",
      return_url: `${process.env.CLIENT_URL}/user/complete/{CHECKOUT_SESSION_ID}`, // Redirect กลับไปที่ Frontend
    });

    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    next(error);
  }
};

exports.checkOutStatus = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // ดึง orderId จาก metadata
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return next(createError(400, "Order ID not found in session metadata"));
    }

    // ตรวจสอบสถานะการชำระเงิน
    if (session.payment_status !== "paid") {
      return next(createError(400, "Payment not completed"));
    }

    // อัปเดต payment_status ใน Order เป็น "Paid"
    await prisma.order.update({
      where: { id: Number(orderId) },
      data: { payment_status: "Paid" },
    });

    res.json({ message: "Payment Complete", status: session.payment_status });
  } catch (error) {
    next(error);
  }
};

