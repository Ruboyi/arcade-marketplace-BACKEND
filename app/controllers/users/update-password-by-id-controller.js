"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { udpatePassworById } = require("../../repositories/users-repository");

const schema = Joi.string().min(4).max(20).required();

async function udpatePassword(req, res) {
  try {
    const { body } = req;

    await schema.validateAsync(body);

    const { password } = body;
    const { idUser } = req.auth;

    await udpatePassworById(idUser, password);

    res.status(200);
    res.send({ message: "Contraseña cambiada correctamente" });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = udpatePassword;
