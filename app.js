"use strict";

require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const { PORT } = process.env;

app.use(fileUpload());
// Para recibir datos como JSON en el BODY
app.use(express.json());
// CORS - Para dar permisos de acceso a otras url's
app.use(cors());
// To serve static files => Archivos públicos.
app.use(express.static("public"));

//const usersRouter = require('./app/routes/users-routes');
const productsRouter = require("./app/routes/products-routes");
const usersRouter = require("./app/routes/users-routes");
const ordersRouter = require("./app/routes/orders-routes");
const reviewsRouter = require("./app/routes/reviews-routes");

app.use("/api/v1/products/", productsRouter);
app.use("/api/v1/users/", usersRouter);
app.use("/api/v1/orders/", ordersRouter);
app.use("/api/v1/reviews/", reviewsRouter);

app.listen(PORT, () => console.log("Running", PORT));
