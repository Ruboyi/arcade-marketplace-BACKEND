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
    await schema.validateAsync(idProduct);
    const product = await findProductByidProduct(idProduct);
    if (!product) {
      throwJsonError(400, "Producto no existe");
    }
    const { idUser, role } = req.auth;
    const { idUser: userId } = product;

    if (role === "admin") {
      await removeProductById(idProduct);
      res
        .status(200)
        .send({ message: `Producto ${idProduct} borrado correctamente!` });
    } else {
      if (idUser !== Number(userId)) {
        throwJsonError(400, "Acceso denegado");
      }
      await removeProductById(idProduct);

      res
        .status(200)
        .send({ message: `Producto ${idProduct} borrado correctamente!` });
    }
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = deleteProductById;
