"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { isAdmin } = require("../../helpers/utils");
const {
  removeProductReportById,
} = require("../../repositories/product-reports-repository");

const schema = Joi.number().positive().integer().required();

async function deleteProductReportById(req, res) {
  try {
    const { role } = req.auth;
    isAdmin(role);

    const { idProductReport } = req.params;

    const id = Number(idProductReport);

    await schema.validateAsync(id);

    await removeProductReportById(id);

    res.status(200).send({ message: "Reporte eliminado correctamente" });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = deleteProductReportById;
