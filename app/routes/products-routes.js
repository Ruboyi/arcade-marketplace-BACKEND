'use strict';

const express = require('express');
const getAllProducts = require('../controllers/products/get-all-products-controller');
const router = express.Router();
// require a los controllers, por ejemplo:
// const nombreFuncion = require('../')

// URL's PÚBLICAS, por ejemplo:
router.route('/').get(getAllProducts);

// URL's PRIVADAS (aquellas que tienen la función validateAuth por delante), por ejemplo:
// router.route('/').all(validateAuth).delete(nombreFuncion)


module.exports = router;