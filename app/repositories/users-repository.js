"use strict";

const getPool = require("../infrastructure/database-infrastructure");

async function findUserById(userId) {
  const pool = await getPool();
  const sql = "SELECT * FROM users WHERE idUser = ?";
  const [user] = await pool.query(sql, userId);
  return user[0];
}

async function findAllUser() {
  const pool = await getPool();
  const sql =
    "SELECT idUser as id,  nameUser, email, phone, createdAt FROM users";
  const [user] = await pool.query(sql);
  return user;
}

async function createUser(user) {
  const pool = await getPool();
  const sql = `
    INSERT INTO users(
      nameUser, email, password, phone, 
      createdAt, verificationCode, role
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const { nameUser, email, passwordHash, phone, verificationCode } = user;
  const now = new Date();
  const [created] = await pool.query(sql, [
    nameUser,
    email,
    passwordHash,
    phone,
    now,
    verificationCode,
    "user",
  ]);

  return created.insertId;
}

async function findUserByEmail(email) {
  const pool = await getPool();
  const sql =
    "SELECT idUser, nameUser, email, role, password,verifiedAt, isBanned FROM users WHERE email = ?";
  const [user] = await pool.query(sql, email);

  return user[0];
}

async function activateUser(verificationCode) {
  const now = new Date();
  const pool = await getPool();
  const sql = `
  UPDATE users
  SET verifiedAt = ?
  WHERE verificationCode = ?
  AND verifiedAt IS NULL
  `;

  const [result] = await pool.query(sql, [now, verificationCode]);

  return result.affectedRows === 1;
}

async function getUserByVerificationCode(code) {
  const pool = await getPool();
  const sql = `
  SELECT nameUser, email, image, phone, createdAt FROM users
  WHERE verificationCode = ?    
  `;
  const [user] = await pool.query(sql, code);
  return user[0];
}

async function udpateUserById(data) {
  const { idUser, nameUser, email, province, phone, bio, password } = data;
  const pool = await getPool();
  const sql = `
    UPDATE users
    SET nameUser = ?, email = ?, province = ?, phone = ?, bio = ?, password = ?
    WHERE idUser = ?
  `;
  await pool.query(sql, [
    nameUser,
    email,
    province,
    phone,
    bio,
    password,
    idUser,
  ]);

  return true;
}

async function addVerificationCode(idUser, code) {
  const now = new Date();
  const pool = await getPool();
  const sql = `
    UPDATE users SET verificationCode = ?,
    updatedAt = ?,
    verifiedAt = NULL
    WHERE idUser = ?
  `;
  const [created] = await pool.query(sql, [code, now, idUser]);

  return created.insertId;
}

async function findUserProfileImage(idUser) {
  const pool = await getPool();
  const sql = "SELECT image FROM users WHERE idUser = ?";
  const [user] = await pool.query(sql, idUser);

  return user[0];
}

async function uploadUserProfileImage(idUser, image) {
  const pool = await getPool();
  const sql = "UPDATE users SET image = ? WHERE idUser = ?";
  await pool.query(sql, [image, idUser]);

  return true;
}

async function removeUserById(id) {
  const pool = await getPool();
  const sql = "DELETE FROM users WHERE idUser = ?";
  await pool.query(sql, id);

  return true;
}

async function findFavoritesByUserId(idUser) {
  const pool = await getPool();
  const sql =
    "SELECT * FROM products INNER JOIN favorites ON products.idProduct = favorites.idProduct WHERE favorites.idUser = ?;";
  const [favorites] = await pool.query(sql, idUser);

  return favorites;
}

async function blockUserById(id) {
  const pool = await getPool();
  const sql = `UPDATE arcade.users SET isBanned = '1' WHERE (idUser = ?);`;
  await pool.query(sql, id);

  return true;
}

async function desBlockUserById(id) {
  const pool = await getPool();
  const sql = `UPDATE arcade.users SET isBanned = '0' WHERE (idUser = ?);`;
  await pool.query(sql, id);

  return true;
}

module.exports = {
  findUserById,
  createUser,
  findUserByEmail,
  activateUser,
  getUserByVerificationCode,
  udpateUserById,
  addVerificationCode,
  findUserProfileImage,
  uploadUserProfileImage,
  removeUserById,
  findFavoritesByUserId,
  findAllUser,
  blockUserById,
  desBlockUserById,
};
