"use strict";

const express = require("express");
const getUserById = require("../controllers/users/get-user-by-id-controller");
const router = express.Router();
// require a los controllers, por ejemplo:
// const nombreFuncion = require('../')

// URL's PÚBLICAS, por ejemplo:
// router.route('/').get(nombreFuncion);
router.route("/:idUser").get(getUserById);

// URL's PRIVADAS (aquellas que tienen la función validateAuth por delante), por ejemplo:
// router.route('/').all(validateAuth).delete(nombreFuncion)

module.exports = router;
