"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const {
  findProductByidProduct,
  removeProductById,
} = require("../../repositories/products-repository");
const schema = Joi.number().integer().positive().required();

async function deleteProductById(req, res) {
  try {
    const { idProduct } = req.params;
    const { idUser } = req.auth;
    const { idUser: userId } = product;
    if (idUser !== Number(userId)) {
      throwJsonError(400, "Acceso denegado");
    }
    await schema.validateAsync(idProduct);
    const product = await findProductByidProduct(idProduct);
    if (!product) {
      throwJsonError(400, "Producto no existe");
    }
    await removeProductById(idProduct);

    res.status(200).send({ message: `${idProduct} borrado correctamente!` });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = deleteProductById;
