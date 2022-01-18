"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");

const {
  addToFavorites,
  findProductByidProduct,
} = require("../../repositories/products-repository");

const schema = Joi.number().positive().required();

async function addToFavoritesByProductId(req, res) {
  try {
    const { idUser } = req.auth;
    const { idProduct } = req.params;
    await schema.validateAsync(idProduct);

    const product = findProductByidProduct(idProduct);
    if (!product) {
      throwJsonError(400, "Producto no existe");
    }

    const idFavorite = await addToFavorites(idUser, idProduct);
    res.status(201);
    res.send({ idFavorite, idUser, idProduct });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = addToFavoritesByProductId;
