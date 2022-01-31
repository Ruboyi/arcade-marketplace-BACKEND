"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const {
  findOrderStatusByProductId,
} = require("../../repositories/orders-repository");
const {
  findImagesByProductId,
} = require("../../repositories/product-images-repository");
const {
  findProductByidProduct,
} = require("../../repositories/products-repository");

const schema = Joi.number().integer().positive().required();

async function getProductByIdProduct(req, res) {
  try {
    const { idProduct } = req.params;
    await schema.validateAsync(idProduct);

    const product = await findProductByidProduct(idProduct);

    if (!product) {
      throwJsonError(400, "No existe el producto");
    }

    const status = await findOrderStatusByProductId(idProduct);

    if (status && status.status === "reservado") {
      product.status = "reservado";
    }

    console.log(status);

    const images = await findImagesByProductId(idProduct);

    product.imagesURL = images;

    res.status(200);
    res.send({ data: product });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getProductByIdProduct;
