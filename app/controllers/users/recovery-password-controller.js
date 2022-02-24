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

const schema = Joi.string().email().required();

async function recoveryPassword(req, res) {
  try {
    const { body } = req;
    await schema.validateAsync(body);

    const { email } = body;

    const user = await findUserByEmail(email);
    if (!user) {
      throwJsonError(400, "No existe usuario con este correo");
    }

    const { idUser, nameUser } = user;

    const { JWT_SECRET } = process.env;
    const tokenPayload = { idUser, nameUser };
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "365 days",
    });

    await sendMailRecoveryPassword(nameUser, email, token);

    const response = {
      accessToken: token,
      expiresIn: "365 days",
    };

    res.status(200);
    res.send(response);
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = recoveryPassword;
