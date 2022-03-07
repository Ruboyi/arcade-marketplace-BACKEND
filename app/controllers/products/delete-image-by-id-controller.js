'use strict';

const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { removeImageByName, findImageByImageName } = require('../../repositories/product-images-repository');
const { findProductByidProduct } = require('../../repositories/products-repository');


async function deleteImageByName(req, res) {
  try {
    const { nameImage } = req.params;

    const image = await findImageByImageName(nameImage);
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

    await removeImageByName(nameImage);

    res.status(200).send({ message: `Imágen ${nameImage} borrada correctamente.` });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = deleteImageByName;
