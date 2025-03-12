require("dotenv").config();
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const notFound = require("./middlewares/notFound");
const handleError = require("./middlewares/handleError");
const app = express();

// import routes ...
const userRoute = require("./routes/user-route");
const productRoute = require("./routes/product-route");
const wishlistRoute = require("./routes/wishlist-route");
const orderRoute = require("./routes/order-route");

// import Middlewares ...
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
); // check logging request
app.use(helmet()); // security for app
app.use(cors()); // allows connection

// route connect ...
app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/wishlist", wishlistRoute)
app.use("/api/order", orderRoute);

// notFound - send 404
app.use(notFound);

// error check - send err code or 500
app.use(handleError);

// run server on port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log("Server is running on PORT", port));
