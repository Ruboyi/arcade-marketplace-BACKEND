"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { addReview } = require("../../repositories/reviews-repository");
const { findUserById } = require("../../repositories/users-repository");

const schema = Joi.object().keys({
  opinion: Joi.string().min(3).max(255).optional(),
  rating: Joi.number().min(0).max(5).required(),
  isSeller: Joi.number().min(0).max(1).required(),
  idUserReviewer: Joi.number().integer().positive().required(),
  idUser: Joi.number().integer().positive().required(),
});

async function createReviewForIdUser(req, res) {
  try {
    const { body } = req;
    const { idUser: idUserReviewer } = req.auth;
    console.log(idUserReviewer);
    const { idUser } = req.params;
    const user = await findUserById(idUser);
    if (!user) {
      throwJsonError(400, "El usuario no existe");
    }
    const { opinion, rating, isSeller } = body;
    const review = { opinion, rating, isSeller, idUserReviewer, idUser };
    await schema.validateAsync(review);
    const idReview = await addReview(review);
    res.status(200);
    res.send({ message: `Review ${idReview} creada correctamente`, review });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = createReviewForIdUser;
