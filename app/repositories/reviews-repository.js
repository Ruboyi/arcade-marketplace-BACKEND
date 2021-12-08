"use strict";

const getPool = require("../infrastructure/database-infrastructure");

async function findAllUserReviewsById(idUser) {
  const pool = await getPool();
  const sql = `SELECT * FROM reviews WHERE idUser = ?`;
  const [reviews] = await pool.query(sql, idUser);
  return reviews;
}

module.exports = {
  findAllUserReviewsById,
};
