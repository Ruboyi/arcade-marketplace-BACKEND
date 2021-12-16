'use strict';
const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { findImagesByProductId } = require('../../repositories/product-images-repository');
const { findProductByidProduct } = require('../../repositories/products-repository');

const schema = Joi.number().integer().positive().required();

async function getImagesByProductId(req, res) {
    try {
      const {idProduct} = req.params;
      await schema.validateAsync(idProduct);
      const product = await findProductByidProduct(idProduct);
    if (!product) {
      throwJsonError(400, 'No existe el producto');
    }
    const images = await findImagesByProductId(idProduct);
    if (images.length === 0) {
    throwJsonError(400, 'No hay imágenes para este producto');
      }
      res.status(200);
      res.send({ data: images });
    } catch (error) {
      createJsonError(error, res);
    }
  }
  
  module.exports = getImagesByProductId;