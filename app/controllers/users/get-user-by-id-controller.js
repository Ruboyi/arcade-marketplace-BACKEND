"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { findUserById } = require("../../repositories/users-repository");
const schema = Joi.number().integer().positive().required();

async function getUserById(req, res) {
  try {
    const { idUser } = req.params;
    await schema.validateAsync(idUser);
    const user = await findUserById(idUser);
    if (!user) {
      throwJsonError(400, "El usuario no existe");
    }
    const {
      nameUser,
      bio,
      email,
      image,
      createdAt,
      verifiedAt,
      isOnline,
      lastLogin,
    } = user;
    res.status(200);
    res.send({
      nameUser,
      bio,
      email,
      image,
      createdAt,
      verifiedAt,
      isOnline,
      lastLogin,
    });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getUserById;
