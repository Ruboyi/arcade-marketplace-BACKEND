"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const {
  getUserByVerificationCode,
  udpatePassworByNameUser,
} = require("../../repositories/users-repository");
const bcrypt = require("bcryptjs");

const schema = Joi.object().keys({
  password: Joi.string().min(4).max(20).required(),
});

async function udpatePassword(req, res) {
  try {
    const { body } = req;

    await schema.validateAsync(body);
    const { code } = req.params;
    if (!code) {
      throwJsonError(400, "Código no válido");
    }
    const user = await getUserByVerificationCode(code);

    const { password } = body;
    const { nameUser } = user;
    const passwordHash = await bcrypt.hash(password, 12);

    await udpatePassworByNameUser(nameUser, passwordHash);

    res.status(200);
    res.send({ message: "Contraseña cambiada correctamente" });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = udpatePassword;
