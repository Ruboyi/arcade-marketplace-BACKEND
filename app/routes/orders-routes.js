"use strict";

const express = require("express");
const validateAuth = require("../middlewares/validate-auth");
const getAllOrdersByProductId = require("../controllers/orders/get-all-orders-by-product-id-controller");
const router = express.Router();

router.route("/:idProduct").all(validateAuth).get(getAllOrdersByProductId);

module.exports = router;
