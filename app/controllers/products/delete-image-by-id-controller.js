'use strict';

const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { findImageByImageId, removeImageById } = require('../../repositories/product-images-repository');
const { findProductByidProduct } = require('../../repositories/products-repository');

const schema = Joi.number().positive().integer().required();

async function deleteImageById(req, res) {
  try {
    const { idImage } = req.params;
    await schema.validateAsync(idImage);
    const image = await findImageByImageId(idImage);
    if (!image) {
      throwJsonError(400, 'La imágen no existe');
    }
    const { idProduct } = image;
    const product = await findProductByidProduct(idProduct);
    if (!product) {
      throwJsonError(400, 'El producto no existe');
    }
    const { idUser } = req.auth;
    const { idUser: userId } = product;
    if (idUser !== userId) {
      throwJsonError(400, 'Acceso denegado');
    }

    await removeImageById(idImage);

    res.status(200).send({ message: `Imágen ${idImage} borrada correctamente.` });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = deleteImageById;
