const nodemailer = require("nodemailer");
const prisma = require("../config/prisma");
const createError = require("../utils/createError");

const transporter = nodemailer.createTransport({
  service: "gmail", // email service
  auth: {
    user: "shoeshoe.notify@gmail.com", // email
    pass: process.env.EMAIL_PASS,
  },
});

exports.orderConfirmation = async (customerEmail, orderId) => {

  // validate request body
  if (!customerEmail || !orderId) {
    createError(400, "Invalid order data or missing customer e-mail")
  }

  try {
    // ค้นหา Order พร้อมรายการสินค้า
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        orderItems: {
          include: {
            product: true, // ดึงข้อมูลสินค้าใน Order_Item
          },
        },
      },
    });

    if (!order) {
      createError(404, "Order Not Found");
    }

    const { total_amount, orderItems } = order;

    // Map order items to format needed for email
    const emailItems = orderItems.map((item) => ({
      name: item.product.productname,
      quantity: item.quantity,
      price: item.price,
      image: item.product.images.match(/(https?:\/\/[^"]+)/)[0]
    }));

    // Send email
    const mailOptions = {
      from: "shoeshoe.notify@gmail.com",
      to: customerEmail,
      subject: `Order Confirmation #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f9; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #eaeaea;">
            <h2 style="color: #333; font-size: 24px; text-align: center; margin-bottom: 20px;">SHOE SHOE</h2>
            <h2 style="color: #333; font-size: 24px; text-align: center; margin-bottom: 20px;">Thank you for your order!</h2>
            <p style="font-size: 16px; color: #555; text-align: center;">We've received your order #${orderId} and are processing it now.</p>
            
            <h3 style="color: #333; font-size: 20px; margin-top: 30px;">Order Summary:</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <thead>
                <tr style="background-color: #f7f7f7; text-align: left; color: #555;">
                  <th style="padding: 12px 15px; border: 1px solid #ddd;">Product</th>
                  <th style="padding: 12px 15px; border: 1px solid #ddd;">Quantity</th>
                  <th style="padding: 12px 15px; border: 1px solid #ddd;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${emailItems
                  .map(
                    (item) => `
                      <tr style="background-color: #ffffff;">
                        <td style="padding: 12px 15px; border: 1px solid #ddd;">
                          <div style="display: flex; align-items: center;">
                            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; margin-right: 10px; border-radius: 4px;" />` : ""}
                            ${item.name}
                          </div>
                        </td>
                        <td style="padding: 12px 15px; border: 1px solid #ddd;">${item.quantity}</td>
                        <td style="padding: 12px 15px; border: 1px solid #ddd;">BTH ${(item.price).toFixed(2)}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
            
            <div style="margin-top: 25px; font-size: 18px; font-weight: bold; color: #333;">
              <p>Total Amount: <span style="color: #f1a10d;">BTH ${(total_amount).toFixed(2)}</span></p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #eaeaea; text-align: center; font-size: 16px; color: #555;">
              <p>If you have any questions about your order, please contact our customer service.</p>
              <p>Thank you for shopping with us!</p>
            </div>
          </div>
        </div>
      `,
    };
    

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
