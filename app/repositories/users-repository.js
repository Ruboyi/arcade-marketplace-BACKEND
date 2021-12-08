"use strict";

const getPool = require("../infrastructure/database-infrastructure");

async function findUserById(userId) {
  const pool = await getPool();
  const sql = "SELECT * FROM users WHERE idUser = ?";
  const [user] = await pool.query(sql, userId);
  return user[0];
}

module.exports = {
  findUserById,
};
