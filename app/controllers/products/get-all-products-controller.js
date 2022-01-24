'use strict';

const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const {
  findImagesByProductId
} = require('../../repositories/product-images-repository');
const {
  findAllProducts
} = require('../../repositories/products-repository');

const { HTTP_SERVER, PATH_PRODUCTS_IMAGE } = process.env;

async function getAllProducts(req, res) {
  try {
    const products = await findAllProducts();
    if (products.length === 0) {
      throwJsonError(400, 'Productos no encontrados');
    }

    const images = [];

    for (const product of products) {
      images.push(await findImagesByProductId(product.idProduct));
    }

    const mapperProductWithIMAGES = products.map((productData, index) => {
      const { idProduct, ...rest } = productData;
      const { nameImage } = images[index][0]; // TODO - AÑADIR FUNCION PARA QUE RECOJA LA MAIN IMAGE
      const imgURL = `${HTTP_SERVER}/${PATH_PRODUCTS_IMAGE}/${idProduct}/${nameImage}`;

      return {
        idProduct,
        ...rest,
        image: imgURL
      };
    });

    res.status(200);
    res.send({ data: mapperProductWithIMAGES });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getAllProducts;
