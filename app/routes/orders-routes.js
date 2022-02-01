"use strict";

const express = require("express");
const validateAuth = require("../middlewares/validate-auth");
const getAllOrdersByProductId = require("../controllers/orders/get-all-orders-by-product-id-controller");
const getAllOrdersByUserBuyerId = require("../controllers/orders/get-all-orders-by-user-buyer-id-controller");
const createOrderByProductId = require("../controllers/orders/create-order-by-product-id-controller");
const acceptOrderByProductId = require("../controllers/orders/accept-order-by-product-id-controller");
const getOrderById = require("../controllers/orders/get-order-by-id-controller");
const getAllOrdersByUserId = require("../controllers/orders/get-all-orders-by-id-user-controller");
const router = express.Router();

router.route("/:idOrder").all(validateAuth).get(getOrderById);
router
  .route("/product/:idProduct")
  .all(validateAuth)
  .get(getAllOrdersByProductId);
router
  .route("/user/:idUserBuyer")
  .all(validateAuth)
  .get(getAllOrdersByUserBuyerId);
router.route("/sellerUser/:idUser").all(validateAuth).get(getAllOrdersByUserId);
router.route("/:idProduct").all(validateAuth).post(createOrderByProductId);
router
  .route("/:idProduct/:idUserBuyer")
  .all(validateAuth)
  .put(acceptOrderByProductId);

module.exports = router;
