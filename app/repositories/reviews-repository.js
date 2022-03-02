"use strict";

const getPool = require("../infrastructure/database-infrastructure");

async function findAllUserReviewsById(idUser) {
  const pool = await getPool();
  const sql = `SELECT idReview, opinion, rating, reviews.createdAt, isSeller, idUserReviewer, reviews.idUser, nameUser, email, image, isChecked FROM reviews INNER JOIN users ON reviews.idUserReviewer = users.idUser WHERE reviews.idUser = ?`;
  const [reviews] = await pool.query(sql, idUser);
  return reviews;
}

async function checkReview(idUser) {
  const check = 1;
  const pool = await getPool();
  const sql = `
    UPDATE reviews INNER JOIN users ON reviews.idUser = users.idUser SET isChecked = ?
    WHERE users.idUser = ?
  `;
  const [updated] = await pool.query(sql, [check, idUser]);
  return updated.affectedRows === 1;
}

async function getAvgRatingById(idUser) {
  const pool = await getPool();
  const sql = `SELECT AVG(rating) as avgRating FROM reviews WHERE idUser = ?;`;
  const [reviews] = await pool.query(sql, idUser);
  return reviews;
}

async function addReview(review) {
  const pool = await getPool();
  const now = new Date();
  const sql = `INSERT
    INTO reviews (opinion, createdAt, rating, isSeller, idUserReviewer, idUser)
    VALUES (?, ?, ?, ?, ?, ?)`;
  const { opinion, rating, isSeller, idUserReviewer, idUser } = review;
  const [created] = await pool.query(sql, [
    opinion,
    now,
    rating,
    isSeller,
    idUserReviewer,
    idUser,
  ]);

  return created.insertId;
}

module.exports = {
  findAllUserReviewsById,
  getAvgRatingById,
  addReview,
  checkReview,
};
