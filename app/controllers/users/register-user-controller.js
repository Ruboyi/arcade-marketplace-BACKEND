"use strict";

const Joi = require("joi");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const {
  createUser,
  findUserByEmail,
} = require("../../repositories/users-repository");
const { sendMailRegister } = require("../../helpers/mail-smtp-SendGrid");

const schema = Joi.object().keys({
  nameUser: Joi.string().min(3).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(20).required(),
  verifyPassword: Joi.ref("password"),
  image: Joi.string().min(3),
});

async function registerUser(req, res) {
  try {
    const { body } = req;
    await schema.validateAsync(body);
    const { nameUser, email, password, image } = body;

    const user = await findUserByEmail(email);
    if (user) {
      throwJsonError(409, "Ya existe un usuario con ese email");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const verificationCode = randomstring.generate(64);

    const userDB = { nameUser, email, passwordHash, verificationCode, image };

    const userId = await createUser(userDB);

    await sendMailRegister(nameUser, email, verificationCode);
    res.status(201);
    res.send({
      idUser: userId,
    });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = registerUser;
