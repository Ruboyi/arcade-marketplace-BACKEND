'use strict';

const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { findOrderById } = require('../../repositories/orders-repository');
const { findProductByidProduct } = require('../../repositories/products-repository');

const schema = Joi.number().integer().positive().required();

async function getOrderById(req, res) {
  try {
    const { idUser } = req.auth;
    const { idOrder } = req.params;
    await schema.validateAsync(idOrder);

    const order = await findOrderById(idOrder);
    if (!order) {
      throwJsonError(400, 'La orden de compra no existe');
    }
    const { idProduct } = order;
    const product = await findProductByidProduct(idProduct);

    if (!product) {
      throwJsonError(400, 'El producto no existe');
    }

    const { idUser: userId } = product;
    if (idUser !== Number(userId)) {
      throwJsonError(400, 'Acceso denegado');
    }

    res.status(200);
    res.send({ data: order });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getOrderById;
