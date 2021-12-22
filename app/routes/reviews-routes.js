"use strict";

const express = require("express");
const createReviewForIdUser = require("../controllers/reviews/create-review-controller");
const getAllUserReviewsByUserId = require("../controllers/reviews/get-all-user-reviews-by-user-id-controller");
const validateAuth = require("../middlewares/validate-auth");
const router = express.Router();

//aqui van las rutas
router.route("/:idUser").get(getAllUserReviewsByUserId);
router.route("/:idUser").all(validateAuth).post(createReviewForIdUser);
module.exports = router;
