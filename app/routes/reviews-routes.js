"use strict";

const express = require("express");
const getAllUserReviewsByUserId = require("../controllers/reviews/get-all-user-reviews-by-user-id-controller");
const validateAuth = require("../middlewares/validate-auth");
const router = express.Router();

//aqui van las rutas
router.route("/:idUser").get(getAllUserReviewsByUserId);

module.exports = router;
