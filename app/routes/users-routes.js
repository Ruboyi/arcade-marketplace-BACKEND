"use strict";

const express = require("express");
const { route } = require("express/lib/application");
const validateUser = require("../controllers/users/activate-user-controller");
const getUserById = require("../controllers/users/get-user-by-id-controller");
const loginUser = require("../controllers/users/login-user-controller");
const registerUser = require("../controllers/users/register-user-controller");
const updateUser = require("../controllers/users/update-user-controller");
const validateAuth = require("../middlewares/validate-auth");
const router = express.Router();

// require a los controllers, por ejemplo:
// const nombreFuncion = require('../')

// URL's PÚBLICAS, por ejemplo:
// router.route('/').get(nombreFuncion);
router.route("/").post(registerUser);
router.route("/activation").get(validateUser);
router.route("/login").post(loginUser);
router.route("/:idUser").get(getUserById);

// URL's PRIVADAS (aquellas que tienen la función validateAuth por delante), por ejemplo:
// router.route('/').all(validateAuth).delete(nombreFuncion)
router.route("/").all(validateAuth).put(updateUser);

module.exports = router;
