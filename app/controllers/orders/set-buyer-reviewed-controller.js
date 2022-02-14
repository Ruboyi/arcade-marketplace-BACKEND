"use strict";

const createJsonError = require("../../errors/create-json-error");
const { setBuyerReviewed,
} = require("../../repositories/orders-repository");

async function setBuyerReviewedByUserId(req, res) {
    try {
        const { idUser } = req.auth;
        const { idUserBuyer } = req.params
        await setBuyerReviewed(idUser, idUserBuyer);

        res.status(200);
        res.send({ message: 'Buyer reviewed' });
    } catch (error) {
        createJsonError(error, res);
    }
}

module.exports = setBuyerReviewedByUserId;
