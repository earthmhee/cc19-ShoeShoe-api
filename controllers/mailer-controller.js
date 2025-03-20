const nodemailer = require("nodemailer")
const prisma = require("../config/prisma")
const createError = require("../utils/createError")

const transporter = nodemailer.createTransport({
    service: 'gmail', // email service
    auth: {
        user: 'shoeshoe.notify@gmail.com', // email
        pass: process.env.EMAIL_PASS
    }
})

exports.orderConfirmation = async (req, res, next) => {
    const { customerEmail, orderNumber } = req.body

    // validate request body
    if (!customerEmail || !orderNumber) {
        return next(createError(400, "Invalid order data or missing customer e-mail"))
    }

    try {
        // ค้นหา Order พร้อมรายการสินค้า
        const order = await prisma.order.findUnique({
            where: { id: Number(orderNumber) },
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

        // Map order items to format needed for email
        const emailItems = orderItems.map((item) => ({
            name: item.product.productname,
            quantity: item.quantity,
            price: item.price,
            image: item.product.images ? (item.product.images.match(/(https?:\/\/[^"]+)/) || [])[0] : ''
        }));

        // Send email
        const mailOptions = {
            from: 'shoeshoe.notify@gmail.com',
            to: customerEmail,
            subject: `Order Confirmation #${orderNumber}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Thank you for your order!</h2>
              <p>We've received your order #${orderNumber} and are processing it now.</p>
              
              <h3>Order Summary:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="background-color: #f2f2f2;">
                  <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Product</th>
                  <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Quantity</th>
                  <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Price</th>
                </tr>
                ${emailItems.map(item => `
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">$${(item.price/100).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </table>
              
              <div style="margin-top: 20px;">
                <p><strong>Total Amount:</strong> $${(total_amount/100).toFixed(2)}</p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p>If you have any questions about your order, please contact our customer service.</p>
                <p>Thank you for shopping with us!</p>
              </div>
            </div>
          `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ success: true, message: 'Email sent successfully' });

    } catch(error) {
        console.error('Error sending email:', error);
        next(createError(500, "Failed to send confirmation email"))
    }
}