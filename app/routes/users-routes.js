"use strict";

const express = require("express");
const validateUser = require("../controllers/users/activate-user-controller");
const banUserById = require("../controllers/users/ban-user-by-id-controller");
const deleteUserById = require("../controllers/users/delete-user-by-id-controller");
const getAllUser = require("../controllers/users/get-all-user-controller");
const getFavoritesByUserId = require("../controllers/users/get-favorites-by-user-id-controller");
const getUserById = require("../controllers/users/get-user-by-id-controller");
const getUserProfile = require("../controllers/users/get-user-profile-controller");
const loginUser = require("../controllers/users/login-user-controller");
const recoveryPassword = require("../controllers/users/recovery-password-controller");
const registerUser = require("../controllers/users/register-user-controller");
const udpatePassword = require("../controllers/users/update-password-by-id-controller");
const updateUser = require("../controllers/users/update-user-controller");
const uploadImageProfile = require("../controllers/users/upload-user-image-profile-controller");
const validateAuth = require("../middlewares/validate-auth");
const router = express.Router();

// require a los controllers, por ejemplo:
// const nombreFuncion = require('../')

// URL's PÚBLICAS, por ejemplo:
// router.route('/').get(nombreFuncion);
router.route("/register").post(registerUser);
router.route("/activation").get(validateUser);
router.route("/recovery-password").post(recoveryPassword);
router.route("/login").post(loginUser);
router.route("/user/:idUser").get(getUserById);
router.route("/password").post(udpatePassword);

// URL's PRIVADAS (aquellas que tienen la función validateAuth por delante), por ejemplo:
// router.route('/').all(validateAuth).delete(nombreFuncion)
router.route("/").all(validateAuth).get(getAllUser).put(updateUser);
router.route("/favorites").all(validateAuth).get(getFavoritesByUserId);
router.route("/upload").all(validateAuth).post(uploadImageProfile);
router
  .route("/:userId")
  .all(validateAuth)
  .delete(deleteUserById)
  .put(banUserById);
router.route("/profile").all(validateAuth).get(getUserProfile);

module.exports = router;
