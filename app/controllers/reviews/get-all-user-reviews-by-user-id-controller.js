"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const {
  findAllUserReviewsById,
} = require("../../repositories/reviews-repository");
const { findUserById } = require("../../repositories/users-repository");
const schema = Joi.number().positive().required();

async function getAllUserReviewsByUserId(req, res) {
  try {
    const { idUser } = req.params;
    await schema.validateAsync(idUser);
    const user = await findUserById(idUser);

    if (!user) {
      throwJsonError(400, "El usuario no existe");
    }
    const reviews = await findAllUserReviewsById(idUser);
    if(reviews.length === 0) {
      throwJsonError(400, "No hay comentarios para este usuario");
    }
    res.status(200);
    res.send({ data: reviews });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getAllUserReviewsByUserId;
