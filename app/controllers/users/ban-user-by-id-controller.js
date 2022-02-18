"use strict";

const throwJsonError = require("../../errors/throw-json-error");
const createJsonError = require("../../errors/create-json-error");
const { isAdmin } = require("../../helpers/utils");
const {
  blockUserById,
  findUserById,
  desBlockUserById,
} = require("../../repositories/users-repository");

async function banUserById(req, res) {
  try {
    const { role } = req.auth;

    isAdmin(role);

    const { userId } = req.params;

    const user = await findUserById(userId);

    if (!user) {
      throwJsonError(400, "El usuario no existe");
    }

    const { isBanned } = user;

    if (isBanned) {
      await desBlockUserById(userId);
      res.status(200);
      res.send({ message: "¡ Usuario desbaneado correctamente !" });
    } else {
      await blockUserById(userId);

      res.status(200);
      res.send({ message: "¡ Usuario banneado correctamente !" });
    }
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = banUserById;
