const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const notFound = require("./middlewares/notFound");
const handleError = require("./middlewares/handleError");

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(cors());
app.use(express.json());

app.use("/");

app.use(notFound);

app.use(handleError);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log("Server is running on PORT", port));
