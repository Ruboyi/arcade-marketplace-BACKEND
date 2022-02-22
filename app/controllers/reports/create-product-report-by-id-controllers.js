"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const {
  addProductReport,
} = require("../../repositories/product-reports-repository");
const {
  findProductByidProduct,
} = require("../../repositories/products-repository");

const schemaProductId = Joi.number().positive().integer().required();

async function createProductReportById(req, res) {
  try {
    const { body } = req;
    const { idUser } = req.auth;
    const { idProduct } = req.params;
    await schemaProductId.validateAsync(idProduct);
    const product = await findProductByidProduct(idProduct);
    if (!product) {
      throwJsonError(400, "El producto no existe");
    }
    const productReport = {
      idUser: idUser,
      idProduct: Number(idProduct),
      isChecked: 0,
      ...body,
    };

    const reportId = await addProductReport(productReport);
    res.status(200);
    res.send({ message: `Producto reportado correctamente` });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = createProductReportById;
