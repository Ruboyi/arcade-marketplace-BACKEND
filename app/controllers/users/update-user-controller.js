'use strict';

const Joi = require('joi');
const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');
const {
  addVerificationCode,
  findUserByEmail,
  findUserById,
  udpateUserById
} = require('../../repositories/users-repository');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const { sendMailRegister } = require('../../helpers/mail-smtp-SendGrid');

const schema = Joi.object().keys({
  nameUser: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  province: Joi.string().min(3).max(20).required(),
  phone: Joi.any().optional(),
  bio: Joi.string().min(3).max(255).optional(),
  password: Joi.string().optional(),
  repeatPassword: Joi.string().optional()
});

const schemaPassword = Joi.object().keys({
  password: Joi.string().min(4).max(20).required(),
  repeatPassword: Joi.ref('password')
});

async function updateUser(req, res) {
  try {
    const { idUser } = req.auth;

    const { body } = req;
    await schema.validateAsync(body);
    const { nameUser, email, province, phone, bio, password, repeatPassword } =
      req.body;

    const userById = await findUserById(idUser);
    const user = await findUserByEmail(email);

    if (user && user.idUser !== idUser) {
      throwJsonError(409, 'Ya existe un usuario con ese email');
    }

    let updatedPassword = userById.password;
    if (password) {
      await schemaPassword.validateAsync({ password, repeatPassword });
      const passwordHash = await bcrypt.hash(password, 12);

      updatedPassword = passwordHash;
    }

    await udpateUserById({
      idUser,
      nameUser,
      email,
      province,
      phone,
      bio,
      password: updatedPassword
    });

    if (email !== userById.email) {
      const verificationCode = randomstring.generate(64);
      await addVerificationCode(idUser, verificationCode);
      await sendMailRegister(nameUser, email, verificationCode);
    }

    res.send({ idUser, nameUser, province, email, phone, bio, role: userById.role });
  } catch (err) {
    createJsonError(err, res);
  }
}

module.exports = updateUser;
