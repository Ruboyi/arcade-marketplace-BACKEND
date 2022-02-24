"use strict";

const Joi = require("joi");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { findUserByEmail } = require("../../repositories/users-repository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  sendMailRecoveryPassword,
} = require("../../helpers/mail-smtp-SendGrid");

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
});

async function recoveryPassword(req, res) {
  try {
    const { body } = req;

    await schema.validateAsync(body);
    const { email } = body;

    const user = await findUserByEmail(email);
    if (!user) {
      throwJsonError(400, "No existe usuario con este correo");
    }

    const { nameUser, verificationCode } = user;

    await sendMailRecoveryPassword(nameUser, email, verificationCode);

    res.status(200);
    res.send({ message: "Correo enviado correctamente" });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = recoveryPassword;
