'use strict';

const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { acceptOrder, findAllOrdersByProductId } = require('../../repositories/orders-repository');
const { findProductByidProduct } = require('../../repositories/products-repository');

const schemaId = Joi.number().integer().positive().required();
const schemaBody = Joi.object().keys({
  saleDate: Joi.date().min('now').required(),
  saleLocation: Joi.string().min(3).max(255).required(),
  saleMessage: Joi.string().min(5).max(255).optional(),
  saleTypeOfContact: Joi.string().valid('phone', 'email').optional(),
});

async function acceptOrderByProductId(req, res) {
  try {
    const { idUser } = req.auth;
    const { body } = req;
    const { saleDate, saleLocation, saleMessage, saleTypeOfContact } = body;
    await schemaBody.validateAsync(body);
    const { idProduct, idUserBuyer } = req.params;
    await schemaId.validateAsync(idProduct);
    await schemaId.validateAsync(idUserBuyer);
    const product = await findProductByidProduct(idProduct);
    if (!product) {
      throwJsonError(400, 'El producto no existe');
    }
    const { idUser: productOwner } = product;
    if (productOwner !== idUser) {
      throwJsonError(400, 'Acceso denegado');
    }

    const productOrders = await findAllOrdersByProductId(idProduct);
    const orderToAccept = productOrders.find((order) => order.idUserBuyer === Number(idUserBuyer));
    if (!orderToAccept) {
      throwJsonError(400, 'La orden de compra no existe');
    }
    // Estos if's son necesarios?
    if (orderToAccept.status === 'reservado' || orderToAccept.status === 'vendido') {
      throwJsonError(400, 'Ya haz reservado o vendido el producto');
    }
    if (orderToAccept.status === 'rechazado') {
      throwJsonError(400, 'La solicitud de compra ya fue rechazada');
    }

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
