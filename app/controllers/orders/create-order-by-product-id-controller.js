'use strict';

const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { sendMailPurchaseOrderNotif } = require('../../helpers/mail-smtp-SendGrid');
const { addOrder, findAllOrdersByUserBuyerId } = require('../../repositories/orders-repository');
const { findProductByidProduct } = require('../../repositories/products-repository');
const { findUserById } = require('../../repositories/users-repository');

const schemaProductId = Joi.number().positive().integer().required();
const schemaOrder = Joi.object().keys({
  orderSubject: Joi.string().min(2).max(120).optional(),
  orderMessage: Joi.string().min(5).max(255).optional(),
  orderTypeOfContact: Joi.string().valid('phone', 'email').optional(),
});

async function createOrderByProductId(req, res) {
  try {
    const { body } = req;
    await schemaOrder.validateAsync(body);
    const { idUser } = req.auth;
    const { idProduct } = req.params;
    await schemaProductId.validateAsync(idProduct);
    const product = await findProductByidProduct(idProduct);
    if (!product) {
      throwJsonError(400, 'El producto no existe');
    }
    const { idUser: productOwner } = product;
    if (idUser === productOwner) {
      throwJsonError(400, 'No puedes solicitar la compra de un producto tuyo');
    }
    const orders = await findAllOrdersByUserBuyerId(idUser);
    const ordersForThatProduct = orders.filter((order) => order.idProduct === Number(idProduct));
    for (const order of ordersForThatProduct) {
      // if status !== rechazado
      if (order.idUserBuyer === idUser) {
        throwJsonError(400, 'Ya has solicitado la compra de este producto');
      }
    }

    // sending purchaseOrder notification
    const { nameUser, email } = await findUserById(productOwner);
    await sendMailPurchaseOrderNotif(nameUser, email);

    const purchaseOrder = { idUserBuyer: idUser, idProduct, ...body };
    const orderId = await addOrder(purchaseOrder);

    res.status(201);
    res.send({
      message: `Solicitud de compra ${orderId} creada correctamente. Vendedor notificado.`,
    });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = createOrderByProductId;
