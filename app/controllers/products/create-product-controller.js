"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const { addProduct } = require("../../repositories/products-repository");

const schema = Joi.object().keys({
  title: Joi.string().min(3).max(120).required(),
  description: Joi.string().min(10).max(255).required(),
  price: Joi.number().positive().precision(2).required(),
  location: Joi.string().min(3).max(120).required(),
  category: Joi.string().valid(
    "consolas",
    "videojuegos",
    "accesorios",
    "arcades"
  ),
  state: Joi.string().valid("nuevo", "seminuevo", "usado"),
  idUser: Joi.number().integer().positive().required(),
});

async function createProduct(req, res) {
  try {
    const { body } = req;
    const { idUser } = req.auth;
    const product = { ...body, idUser: idUser };
    await schema.validateAsync(product);
    const productId = await addProduct(product);

    res.status(201);
    res.send({
      message: `Producto ${productId} creado correctamente`,
      productId: `${productId}`,
    });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = createProduct;
