"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const {
  findUserById,
  findFavoritesByUserId,
} = require("../../repositories/users-repository");

const schema = Joi.number().positive().required();

async function getFavoritesByUserId(req, res) {
  try {
    const { idUser } = req.auth;
    await schema.validateAsync(idUser);
    const user = await findUserById(idUser);
    if (!user) {
      throwJsonError(400, "El usuario no existe");
    }
    const favorites = await findFavoritesByUserId(idUser);

    if (favorites.length === 0) {
      throwJsonError(400, "No hay favoritos");
    }
    res.status(200);
    res.send({ data: favorites });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getFavoritesByUserId;
