"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { removeUserById } = require("../../repositories/users-repository");

const schema = Joi.number().positive();

async function deleteUserById(req, res) {
  try {
    const { idUser } = req.auth;
    if (!idUser) {
      throwJsonError(400, "No tienes permisos");
    }
    await removeUserById(idUser);

    res.status(204).send({ message: "Usuario eliminado" });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = deleteUserById;
