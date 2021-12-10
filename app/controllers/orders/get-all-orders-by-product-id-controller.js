'use strict';
const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { findAllOrdersByProductId } = require('../../repositories/orders-repository');

const schema = Joi.number().integer().positive().required();

async function getAllOrdersByProductId(req, res) {
  try {
    const { idUser } = req.auth;
    const { idProduct } = req.params;
    await schema.validateAsync(idProduct);
    const orders = await findAllOrdersByProductId(idProduct);
    if (orders.length === 0) {
      throwJsonError(400, 'No hay ordenes de compra');
    }
    res.status(200);
    res.send({ data: orders });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getAllOrdersByProductId;
