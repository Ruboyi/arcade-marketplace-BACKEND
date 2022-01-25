"use strict";

const express = require("express");

const addToFavoritesByProductId = require("../controllers/products/add-to-favorites-by-product-idcontroller");
const createProduct = require("../controllers/products/create-product-controller");
const deleteFromFavoritesByIds = require("../controllers/products/delete-from-favorites-by-ids");
const deleteImageById = require("../controllers/products/delete-image-by-id-controller");
const deleteProductById = require("../controllers/products/delete-product-by-id-controller");
const getAllProducts = require("../controllers/products/get-all-products-controller");
const getImagesByProductId = require("../controllers/products/get-images-by-product-id-controller");
const getNumberOfFavs = require("../controllers/products/get-number-of-favs-controller");
const getProductByIdProduct = require("../controllers/products/get-product-by-idProduct-controller");
const getProductsByUserId = require("../controllers/products/get-products-by-user-id-controller");
const updateProductById = require("../controllers/products/update-product-by-id-controller");
const updateTimesVisitedById = require("../controllers/products/update-times-visited-controller");
const uploadProductImageById = require("../controllers/products/upload-product-image-by-id-controller");
const validateAuth = require("../middlewares/validate-auth");
const router = express.Router();

// require a los controllers, por ejemplo:
// const nombreFuncion = require('../')

// URL's PÚBLICAS:

router.route("/").get(getAllProducts);
router.route("/:idProduct").get(getProductByIdProduct);
router.route("/favorites/:idProduct").get(getNumberOfFavs);
router.route("/times-visited/:idProduct").put(updateTimesVisitedById);
router.route("/images/:idProduct").get(getImagesByProductId);

// URL's PRIVADAS (aquellas que tienen la función validateAuth por delante):

router.route("/").all(validateAuth).post(createProduct);
router.route("/user/:userId").all(validateAuth).get(getProductsByUserId);
router
  .route("/:idProduct")
  .all(validateAuth)
  .post(addToFavoritesByProductId)
  .put(updateProductById)
  .delete(deleteProductById);
router
  .route("/images/:idProduct")
  .all(validateAuth)
  .post(uploadProductImageById);
router.route("/images/:idImage").all(validateAuth).delete(deleteImageById);
router
  .route("/favorites/:idProduct")
  .all(validateAuth)
  .delete(deleteFromFavoritesByIds);

module.exports = router;
