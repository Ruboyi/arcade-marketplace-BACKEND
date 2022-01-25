'use strict';

const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { updateTimesVisited, findProductByidProduct } = require('../../repositories/products-repository');

const schemaIdProduct = Joi.number().positive().required();

async function updateTimesVisitedById(req, res) {
    try {
        const { idProduct } = req.params;
        await schemaIdProduct.validateAsync(idProduct);
        const product = await findProductByidProduct(idProduct);

        if (!product) {
            throwJsonError(400, 'El producto no existe');
        }
        const { body } = req;
        const { timesVisited } = product;
        const newTimesVisited = timesVisited + 1

        await updateTimesVisited(idProduct, newTimesVisited);

        res.status(200);
        res.send({ message: `Producto ${idProduct} actualizado correctamente.`, body });
    } catch (error) {
        createJsonError(error, res);
    }
}

module.exports = updateTimesVisitedById;
