'use strict';

const Joi = require('joi');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { updateProduct, findProductByidProduct } = require('../../repositories/products-repository');

const schemaIdProduct = Joi.number().positive().required();

const schema = Joi.object().keys({
    title: Joi.string().min(4).max(120).required(),
    description: Joi.string().min(10).max(255).required(),
    price: Joi.number().positive().precision(2).required(),
    location: Joi.string().min(3).max(120).required(),
    category: Joi.string().valid('consolas', 'videojuegos', 'accesorios', 'arcades'),
    state: Joi.string().valid('nuevo', 'seminuevo', 'usado')
});

async function updateProductById(req, res) {
    try {
        const { idProduct } = req.params;
        await schemaIdProduct.validateAsync(idProduct);
        const { idUser } = req.auth;
        const product = await findProductByidProduct(idProduct);
        if(!product){
            throwJsonError(400,'El producto no existe');
        }
        const { body } = req;
        await schema.validateAsync(body);

        await updateProduct(idUser, body);

        res.status(204);
        res.end();
    } catch (error) {
        createJsonError(error, res);
    }
}

module.exports = updateProductById;