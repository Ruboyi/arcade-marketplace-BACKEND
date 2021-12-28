'use strict';

const express = require('express');
const validateAuth = require('../middlewares/validate-auth');
const getAllOrdersByProductId = require('../controllers/orders/get-all-orders-by-product-id-controller');
const getAllOrdersByUserBuyerId = require('../controllers/orders/get-all-orders-by-user-buyer-id-controller');
const createOrderByProductId = require('../controllers/orders/create-order-by-product-id-controller');
const router = express.Router();

router.route('/:idProduct').all(validateAuth).get(getAllOrdersByProductId);
router.route('/user/:idUserBuyer').all(validateAuth).get(getAllOrdersByUserBuyerId);
router.route('/:idProduct').all(validateAuth).post(createOrderByProductId);

module.exports = router;
