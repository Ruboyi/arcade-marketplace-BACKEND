"use strict";

const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { isAdmin } = require("../../helpers/utils");
const {
  findAllProductsReports,
} = require("../../repositories/product-reports-repository");

async function getAllProductsReports(req, res) {
  try {
    const { role } = req.auth;

    isAdmin(role);

    const reports = await findAllProductsReports();

    if (!reports) {
      throwJsonError(400, "No hay ningún reporte");
    }

    res.status(200);
    res.send({ data: reports });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getAllProductsReports;
