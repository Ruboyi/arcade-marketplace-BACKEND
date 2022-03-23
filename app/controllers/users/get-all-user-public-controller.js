"use strict";

const createJsonError = require("../../errors/create-json-error");
const { findAllUserPublic } = require("../../repositories/users-repository");

async function getAllUserPublic(req, res) {
  try {
    const users = await findAllUserPublic();
    res.status(200);
    res.send({ data: users });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getAllUserPublic;
