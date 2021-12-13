'use strict';

const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const uploadImage = require('../../helpers/upload-image');
const { removeMainImageByidProduct, addImageByProductId } = require('../../repositories/product-images-repository');
const { findProductByidProduct } = require('../../repositories/products-repository');

const { HTTP_SERVER, PATH_PRODUCTS_IMAGE } = process.env;

const schema = Joi.number().positive().integer().required();

const schemaMainImage = Joi.boolean();

async function uploadProductImageById(req, res) {
  try {
    const { idProduct } = req.params;
    await schema.validateAsync(idProduct);
    const { idUser } = req.auth;

    const product = await findProductByidProduct(idProduct);

    if (!product) {
      throwJsonError(400, 'No existe el producto');
    }

    const { idUser: userId } = product;
    if (idUser !== Number(userId)) {
      throwJsonError(400, 'Acceso denegado');
    }

    const { body } = req;
    const { mainImage } = body;
    await schemaMainImage.validateAsync(mainImage);

    const { files } = req;
    if (!files || Object.keys(files).length === 0) {
      throwJsonError(400, 'No se ha seleccionado ningún fichero');
    }

    const { productImage } = files;
    if (!productImage) {
      throwJsonError(400, 'Fichero subido no válido');
    }
    if (!productImage.mimetype.startsWith('image')) {
      throwJsonError(400, 'Formato no valido');
    }
    const processImage = await uploadImage({
      imageData: productImage.data,
      destination: `${PATH_PRODUCTS_IMAGE}/${idProduct}`,
      width: 600,
      height: 600,
      codImage: idProduct,
    });
    if (mainImage) {
      await removeMainImageByidProduct(idProduct);
    }
    await addImageByProductId(idProduct, processImage, mainImage);
    res.status(201);
    res.send({ image: `${HTTP_SERVER}/${PATH_PRODUCTS_IMAGE}/${idProduct}/${processImage}` });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = uploadProductImageById;
