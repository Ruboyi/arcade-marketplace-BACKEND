'use strict';
const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { findAllOrdersByUserBuyerId } = require('../../repositories/orders-repository');

const schema = Joi.number().integer().positive().required();

async function getAllOrdersByUserBuyerId(req, res) {
  try {
    const { idUser } = req.auth;
    const { idUserBuyer } = req.params;
    await schema.validateAsync(idUserBuyer);
    if (Number(idUserBuyer) !== idUser) {
      throwJsonError (400, 'Acceso denegado');
    };
    const orders = await findAllOrdersByUserBuyerId(idUserBuyer);
    if (orders.length === 0) {
      throwJsonError(400, 'No hay ordenes de compra');
    }
    res.status(200);
    res.send({ data: orders });
  } catch (error) {
    createJsonError(error, res);
  }
};

module.exports = getAllOrdersByUserBuyerId;