'use strict';

const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const {
  findImagesByProductId
} = require('../../repositories/product-images-repository');
const {
  findProductsByUserId
} = require('../../repositories/products-repository');

const schema = Joi.number().positive().integer().required();

async function getProductsByUserId(req, res) {
  try {
    const { userId } = req.params;
    await schema.validateAsync(userId);
    const { idUser } = req.auth;

    if (idUser !== Number(userId)) {
      throwJsonError(400, 'Acceso denegado');
    }

    let products = await findProductsByUserId(userId);

    const images = [];

    for (const product of products) {
      images.push(await findImagesByProductId(product.idProduct));
    }

    const mapperProductWithImages = products.map((productData, index) => {
      const { idProduct, ...rest } = productData;

      return {
        idProduct,
        ...rest,
        images: images[index]
      };
    });

    res.status(200);
    res.send({ data: mapperProductWithImages });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getProductsByUserId;
