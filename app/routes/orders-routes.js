"use strict";

const express = require("express");
const validateAuth = require("../middlewares/validate-auth");
const getAllOrdersByProductId = require("../controllers/orders/get-all-orders-by-product-id-controller");
const getAllOrdersByUserBuyerId = require("../controllers/orders/get-all-orders-by-user-buyer-id-controller");
const router = express.Router();

router.route("/:idProduct").all(validateAuth).get(getAllOrdersByProductId);

router.route("/user/:idUserBuyer").all(validateAuth).get(getAllOrdersByUserBuyerId);

module.exports = router;
