'use strict';

const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const {
  findImagesByProductId
} = require('../../repositories/product-images-repository');
const {
  findUserById,
  findFavoritesByUserId
} = require('../../repositories/users-repository');

const schema = Joi.number().positive().required();

async function getFavoritesByUserId(req, res) {
  try {
    const { idUser } = req.auth;
    await schema.validateAsync(idUser);
    const user = await findUserById(idUser);
    if (!user) {
      throwJsonError(400, 'El usuario no existe');
    }
    const favorites = await findFavoritesByUserId(idUser);

    const images = [];

    for (const product of favorites) {
      images.push(await findImagesByProductId(product.idProduct));
    }

    const mapperProductWithImages = favorites.map((productData, index) => {
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

module.exports = getFavoritesByUserId;
