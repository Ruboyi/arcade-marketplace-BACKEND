"use strict";

const createJsonError = require("../../errors/create-json-error");
const { checkOrder,
} = require("../../repositories/orders-repository");

async function checkOrdersByUserId(req, res) {
    try {
        const { idUser } = req.auth;
        await checkOrder(idUser);

        res.status(200);
        res.send({ message: 'Ordenes checkeadas' });
    } catch (error) {
        createJsonError(error, res);
    }
}

module.exports = checkOrdersByUserId;
