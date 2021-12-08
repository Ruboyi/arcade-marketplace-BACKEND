'use strict';

const createJsonError = require('../../errors/create-json-error'); 
const throwJsonError = require('../../errors/throw-json-error'); 
const { findAllProducts } = require('../../repositories/products-repository');


async function getAllProducts(req, res) {
  try {
    const products = await findAllProducts();
    if(products.length === 0){
        throwJsonError(400, 'Productos no encontrados')
    }
    res.status(200);
    res.send({ data:products});
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getAllProducts;