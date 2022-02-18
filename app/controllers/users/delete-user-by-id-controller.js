"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { removeUserById } = require("../../repositories/users-repository");

const schema = Joi.number().positive().integer().required();

async function deleteUserById(req, res) {
  try {
    const { userId } = req.params;
    await schema.validateAsync(userId);
    const { idUser, role } = req.auth;

    if (role === "admin") {
      await removeUserById(userId);
      res.status(200).send({ message: "Usuario eliminado" });
    } else {
      if (idUser !== Number(userId)) {
        throwJsonError(400, "Acceso denegado");
      }

      await removeUserById(idUser);

      res.status(200).send({ message: "Usuario eliminado" });
    }
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = deleteUserById;
