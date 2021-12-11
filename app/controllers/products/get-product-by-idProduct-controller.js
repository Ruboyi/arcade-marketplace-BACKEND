'use strict';
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { findProductByidProduct } = require('../../repositories/products-repository');


async function getProductByIdProduct(req, res) {
  try {
    const { idProduct } = req.params;
    const product = await findProductByidProduct(idProduct);
    if (product.length === 0) {
      throwJsonError(400, 'Parámetro no válido');
    }
    res.status(200);
    res.send({data: product});
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getProductByIdProduct;