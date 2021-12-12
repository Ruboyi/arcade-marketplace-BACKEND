'use strict';

const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { findProductByidProduct } = require('../../repositories/products-repository');

const schema = Joi.number().integer().positive().required();

async function getProductByIdProduct(req, res) {
  try {
    const { idProduct } = req.params;
    await schema.validateAsync(idProduct);

    const product = await findProductByidProduct(idProduct);

    if (!product) {
      throwJsonError(400, 'No existe el producto');
    }

    res.status(200);
    res.send({ data: product });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getProductByIdProduct;
