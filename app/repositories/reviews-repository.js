"use strict";

const getPool = require("../infrastructure/database-infrastructure");

async function findAllUserReviewsById(idUser) {
  const pool = await getPool();
  const sql = `SELECT idReview, opinion, rating, isSeller, idUserReviewer, reviews.idUser, nameUser, email, image FROM reviews INNER JOIN users ON reviews.idUserReviewer = users.idUser WHERE reviews.idUser = ?`;
  const [reviews] = await pool.query(sql, idUser);
  return reviews;
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
};
