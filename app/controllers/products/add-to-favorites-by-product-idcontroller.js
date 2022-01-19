"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");

const {
  addToFavorites,
  findProductByidProduct,
} = require("../../repositories/products-repository");
const {
  findFavoritesByUserId,
} = require("../../repositories/users-repository");

const schema = Joi.number().positive().required();

async function addToFavoritesByProductId(req, res) {
  try {
    const { idUser } = req.auth;
    const { idProduct } = req.params;
    await schema.validateAsync(idProduct);

    const product = await findProductByidProduct(idProduct);
    const productFavorite = await findFavoritesByUserId(idUser);

    if (!product) {
      throwJsonError(400, "Producto no existe");
    }
    if (idUser === product.idUser) {
      throwJsonError(400, "No puedes añadir tu producto a favoritos");
    }
    if (productFavorite.some((e) => e.idProduct == idProduct)) {
      throwJsonError(400, "Ya tienes este producto en favoritos");
    }
    const idFavorite = await addToFavorites(idUser, idProduct);
    res.status(201);
    res.send({ idFavorite, idUser, idProduct });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = addToFavoritesByProductId;
