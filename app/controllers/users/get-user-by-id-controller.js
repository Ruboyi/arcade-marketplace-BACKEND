"use strict";

const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { findUserById } = require("../../repositories/users-repository");

async function getUserById(req, res) {
  try {
    const { idUser } = req.params;
    const user = await findUserById(idUser);
    if (!user) {
      throwJsonError(400, "El usuario no existe");
    }
    const { nameUser, email, image, createdAt } = user;
    res.status(200);
    res.send({ nameUser, email, image, createdAt });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getUserById;
