"use strict";

const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const {
  sendMailCorrectValidation,
} = require("../../helpers/mail-smtp-SendGrid");
const {
  activateUser,
  getUserByVerificationCode,
} = require("../../repositories/users-repository");

const { FRONTEND_URL } = process.env;

async function validateUser(req, res) {
  try {
    const { code } = req.query;

    if (!code) {
      throwJsonError(400, "Codigo no valido");
    }

    const isActivated = await activateUser(code);

    if (!isActivated) {
      throwJsonError(400, "Codigo no valido, no se pudo activar.");
    }

    const user = await getUserByVerificationCode(code);
    const { nameUser, email } = user;

    await sendMailCorrectValidation(nameUser, email);

    res.status(200);
    res.redirect(`${FRONTEND_URL}/activacion`);

    //res.send({ message: "Cuenta activada." });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = validateUser;
