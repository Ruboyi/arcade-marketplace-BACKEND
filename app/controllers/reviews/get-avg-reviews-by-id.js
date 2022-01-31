"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const {
    getAvgRatingById,
} = require("../../repositories/reviews-repository");
const { findUserById } = require("../../repositories/users-repository");
const schema = Joi.number().positive().required();

async function getAvgRatingByUserId(req, res) {
    try {
        const { idUser } = req.params;
        await schema.validateAsync(idUser);
        const user = await findUserById(idUser);

        if (!user) {
            throwJsonError(400, "El usuario no existe");
        }
        const rating = await getAvgRatingById(idUser);

        res.status(200);
        res.send({ data: rating });
    } catch (error) {
        createJsonError(error, res);
    }
}

module.exports = getAvgRatingByUserId;