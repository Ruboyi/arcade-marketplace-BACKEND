'use strict';

const express = require('express');
const { route } = require('express/lib/application');
const validateUser = require('../controllers/users/activate-user-controller');
const getUserById = require('../controllers/users/get-user-by-id-controller');
const registerUser = require('../controllers/users/register-user-controller');
const router = express.Router();
// require a los controllers, por ejemplo:
// const nombreFuncion = require('../')

// URL's PÚBLICAS, por ejemplo:
// router.route('/').get(nombreFuncion);
router.route('/').post(registerUser);
router.route('/activation').get(validateUser);
router.route('/:idUser').get(getUserById);
// URL's PRIVADAS (aquellas que tienen la función validateAuth por delante), por ejemplo:
// router.route('/').all(validateAuth).delete(nombreFuncion)

module.exports = router;
