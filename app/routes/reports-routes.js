"use strict";

const express = require("express");

const createProductReportById = require("../controllers/reports/create-product-report-by-id-controllers");
const getAllProductsReports = require("../controllers/reports/get-all-products-reports-controller");

const validateAuth = require("../middlewares/validate-auth");
const router = express.Router();

router.route("/").all(validateAuth).get(getAllProductsReports);
router.route("/:idProduct").all(validateAuth).post(createProductReportById);

module.exports = router;
