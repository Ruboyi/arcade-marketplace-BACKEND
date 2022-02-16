"use strict";

const createJsonError = require("../../errors/create-json-error");
const { isAdmin } = require("../../helpers/utils");
const { findAllUser } = require("../../repositories/users-repository");

async function getAllUser(req, res) {
  try {
    const { role } = req.auth;
    isAdmin(role);
    const users = await findAllUser();
    res.status(200);
    res.send({ data: users });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getAllUser;
