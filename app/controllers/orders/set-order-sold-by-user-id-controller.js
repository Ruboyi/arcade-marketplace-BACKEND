"use strict";

const createJsonError = require("../../errors/create-json-error");
const { setSold,
} = require("../../repositories/orders-repository");

async function setSoldByUserId(req, res) {
    try {
        const { idUser } = req.auth;
        const { idUserBuyer, idOrder } = req.params
        await setSold(idUser, idUserBuyer, idOrder);

        res.status(200);
        res.send({ message: 'Status updated to vendido' });
    } catch (error) {
        createJsonError(error, res);
    }
}

module.exports = setSoldByUserId;
