"use strict";

const createJsonError = require("../../errors/create-json-error");
const {
  updateUserLogoutById,
  updateLastLoginById,
} = require("../../repositories/users-repository");

async function logoutUser(req, res) {
  try {
    const { idUser } = req.auth;

    await updateLastLoginById(idUser);

    await updateUserLogoutById(idUser);

    res.status(200);
    res.send();
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = logoutUser;
