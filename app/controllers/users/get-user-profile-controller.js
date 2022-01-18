"use strict";

const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { findUserById } = require("../../repositories/users-repository");

async function getUserProfile(req, res) {
  try {
    console.log(req.auth);
    const { idUser } = req.auth;
    console.log(idUser);
    const user = await findUserById(idUser);
    if (!user) {
      throwJsonError(400, "El usuario no existe");
    }
    const { nameUser, email, image, phone, createdAt } = user;
    res.status(200);
    res.send({ nameUser, email, image, phone, createdAt });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getUserProfile;
