"use strict";

const createJsonError = require("../../errors/create-json-error");
const { checkReview,
} = require("../../repositories/reviews-repository");

async function checkReviewsByUserId(req, res) {
    try {
        const { idUser } = req.auth;
        await checkReview(idUser);

        res.status(200);
        res.send({ message: 'Reviews checkeadas' });
    } catch (error) {
        createJsonError(error, res);
    }
}

module.exports = checkReviewsByUserId;
