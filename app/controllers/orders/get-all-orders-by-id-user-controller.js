"use strict";

const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const {
  findAllOrdersByIdUser,
} = require("../../repositories/orders-repository");

async function getAllOrdersByUserId(req, res) {
  try {
    const { idUser } = req.auth;
    const orders = await findAllOrdersByIdUser(idUser);
    if (!orders) {
      throwJsonError(400, "No hay ordenes de comprar");
    }
    res.status(200);
    res.send({ data: orders });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getAllOrdersByUserId;
