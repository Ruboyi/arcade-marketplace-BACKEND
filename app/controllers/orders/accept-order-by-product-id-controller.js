'use strict';

const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { acceptOrder, findAllOrdersByProductId } = require('../../repositories/orders-repository');
const { findProductByidProduct } = require('../../repositories/products-repository');

const schemaProductId = Joi.number().integer().positive().required();
const schemaBody = Joi.object().keys({
  idUserBuyer: Joi.number().positive().integer().required(),
  saleDate: Joi.date().min('now').required(),
  saleLocation: Joi.string().min(3).max(255).required(),
  saleMessage: Joi.string().min(5).max(255).optional(),
  saleTypeOfContact: Joi.string().valid('phone', 'email').optional(),
});

async function acceptOrderByProductId(req, res) {
  try {
    const { body } = req;
    await schemaBody.validateAsync(body);
    const { idUser } = req.auth;
    const { idProduct } = req.params;
    await schemaProductId.validateAsync(idProduct);
    const product = await findProductByidProduct(idProduct);
    if (!product) {
      throwJsonError(400, 'El producto no existe');
    }
    const { idUser: productOwner } = product;

    if (productOwner !== idUser) {
      throwJsonError(400, 'Acceso denegado');
    }

    const productOrders = await findAllOrdersByProductId(idProduct);
    // de que manera puedo saber cual es el userBuyer ??? de momento lo pongo en el body
    const { idUserBuyer, saleDate, saleLocation, saleMessage, saleTypeOfContact } = body;
    const orderToAccept = productOrders.find((order) => order.idUserBuyer === idUserBuyer);
    if (!orderToAccept) {
      throwJsonError(400, 'La orden de compra no existe');
    }
    if (orderToAccept.status === 'reservado' || orderToAccept.status === 'vendido') {
      throwJsonError(400, 'Ya haz reservado o vendido el producto');
    }
    // vale la pena un if de orderToAccept.status === 'rechazado' ????????????????????????

    // --------------------------------

    // send email notification ......
    // --------------------------------

    const saleData = { saleDate, saleLocation, saleMessage, saleTypeOfContact };
    const orderId = orderToAccept.idOrder;

    await acceptOrder(saleData, idProduct, idUserBuyer);

    res.status(200);
    res.send({
      message: `Producto ${idProduct} reservado. Orden de compra ${orderId} actualizada correctamente.`,
    });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = acceptOrderByProductId;
