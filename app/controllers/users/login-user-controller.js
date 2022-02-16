"use strict";

const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { findUserByEmail } = require("../../repositories/users-repository");
const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(20).required(),
});

async function loginUser(req, res) {
  try {
    const { body } = req;
    await schema.validateAsync(body);

    const { email, password } = body;
    const user = await findUserByEmail(email);
    if (!user) {
      throwJsonError(403, "No existe un usuario con ese email y/o password");
    }
    const { idUser, nameUser, role, password: passwordHash, verifiedAt } = user;
    const isValidPassword = await bcrypt.compare(password, passwordHash);
    if (!isValidPassword) {
      throwJsonError(403, "No existe un usuario con ese email y/o password");
    }
    if (!verifiedAt) {
      throwJsonError(
        401,
        "Verifique su cuenta poder acceder a nuestros servicios"
      );
    }
    const { JWT_SECRET } = process.env;
    const tokenPayload = { idUser, nameUser, role };
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "365 days",
    });
    const response = {
      accessToken: token,
      expiresIn: "365 days",
      role: role,
    };

    res.status(200);
    res.send(response);
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = loginUser;
