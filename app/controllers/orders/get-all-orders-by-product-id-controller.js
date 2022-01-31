'use strict';
const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { findAllOrdersByProductId } = require('../../repositories/orders-repository');
const { findProductByidProduct } = require('../../repositories/products-repository');

const schema = Joi.number().integer().positive().required();

async function getAllOrdersByProductId(req, res) {
  try {
    const { idUser } = req.auth;
    const { idProduct } = req.params;
    await schema.validateAsync(idProduct);
    const product = await findProductByidProduct(idProduct);
    if (!product) {
      throwJsonError(400, 'El producto no existe');
    }

    const { idUser: userId } = product;
    if (idUser !== userId) {
      throwJsonError(400, 'Acceso denegado');
    }

    const orders = await findAllOrdersByProductId(idProduct);

    res.status(200);
    res.send({ data: orders });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getAllOrdersByProductId;
