'use strict';

const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { findProductsByUserId } = require('../../repositories/products-repository');

const schema = Joi.number().positive().integer().required();

async function getProductsByUserId(req, res) {
  try {
    const { idUser } = req.auth;
    await schema.validateAsync(idUser);

    const products = await findProductsByUserId(idUser);
    if (products.length === 0) {
      throwJsonError(400, 'No tienes productos');
    }
    res.status(200);
    res.send({ data: products });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getProductsByUserId;
