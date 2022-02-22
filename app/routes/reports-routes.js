"use strict";

const express = require("express");

const createProductReportById = require("../controllers/reports/create-product-report-by-id-controllers");
const deleteProductReportById = require("../controllers/reports/delete-product-report-by-id-controller");
const getAllProductsReports = require("../controllers/reports/get-all-products-reports-controller");

const validateAuth = require("../middlewares/validate-auth");
const router = express.Router();

router.route("/").all(validateAuth).get(getAllProductsReports);
router.route("/:idProduct").all(validateAuth).post(createProductReportById);
router
  .route("/:idProductReport")
  .all(validateAuth)
  .delete(deleteProductReportById);

module.exports = router;
