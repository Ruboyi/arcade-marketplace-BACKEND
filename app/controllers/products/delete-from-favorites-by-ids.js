"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const {
  findProductByidProduct,
  removeFromFavoritesByIds,
} = require("../../repositories/products-repository");

const schema = Joi.number().integer().positive().required();

async function deleteFromFavoritesByIds(req, res) {
  try {
    const { idUser } = req.auth;
    const { idProduct } = req.params;
    await schema.validateAsync(idProduct);

    const product = await findProductByidProduct(idProduct);
    if (!product) {
      throwJsonError(400, "El producto no existe");
    }
    await removeFromFavoritesByIds(idUser, idProduct);

    res
      .status(200)
      .send({ message: `${idProduct} borrado de favoritos correctamente!` });
    res.end();
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = deleteFromFavoritesByIds;
