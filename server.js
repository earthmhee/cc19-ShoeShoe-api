require("dotenv").config();
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const notFound = require("./middlewares/notFound");
const handleError = require("./middlewares/handleError");
const { clerkMiddleware } = require("@clerk/express");
const app = express();

// import Middlewares ...
app.use(clerkMiddleware()); // Auth check from Clerk

// import routes ...
const userRoute = require("./routes/user-route");
const productRoute = require("./routes/product-route");
const cartRoute = require("./routes/cart-route");
const wishlistRoute = require("./routes/wishlist-route");
const orderRoute = require("./routes/order-route");
const paymentRoute = require("./routes/payment-route");

// import Middlewares ...
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms")
); // check logging request
app.use(helmet()); // security for app
// ตั้งค่า CORS
app.use(
	cors({
		origin: "http://localhost:5173", // ระบุ origin ของ frontend
		credentials: true, // อนุญาตให้ส่ง credentials
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// จัดการ preflight request (OPTIONS)
app.options("*", cors()); // allows connection

// route connect ...
app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/order", orderRoute);
app.use("/api/payment", paymentRoute);

// notFound - send 404
app.use(notFound);

// error check - send err code or 500
app.use(handleError);

// run server on port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log("Server is running on PORT", port));
