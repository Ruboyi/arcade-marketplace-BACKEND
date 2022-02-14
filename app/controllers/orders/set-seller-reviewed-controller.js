"use strict";

const createJsonError = require("../../errors/create-json-error");
const { setSellerReviewed,
} = require("../../repositories/orders-repository");

async function setSellerReviewedByUserId(req, res) {
    try {
        const { idUser } = req.auth;
        const { idUserSeller } = req.params
        await setSellerReviewed(idUserSeller, idUser);

        res.status(200);
        res.send({ message: 'seller reviewed' });
    } catch (error) {
        createJsonError(error, res);
    }
}

module.exports = setSellerReviewedByUserId;
