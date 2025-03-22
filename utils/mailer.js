const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // หรือใช้ SMTP Server อื่น เช่น Mailgun, SendGrid
  auth: {
    user: process.env.EMAIL_USER, // อีเมลของคุณ
    pass: process.env.EMAIL_PASS, // ใช้ App Password แทนรหัสผ่านปกติ
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    let info = await transporter.sendMail({
      from: `"Your Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
