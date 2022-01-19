'use strict';

const getPool = require('../infrastructure/database-infrastructure');

async function findAllProducts() {
  const pool = await getPool();
  const sql = `SELECT * FROM products`;
  const [products] = await pool.query(sql);
  return products;
}

async function addProduct(product) {
  const pool = await getPool();
  const now = new Date();
  const sql = `INSERT INTO products(
        title,
        description,
        price,
        location,
        createdAt,
        category,
        state,
        idUser
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
  const { title, description, price, location, category, state, idUser } = product;
  const [created] = await pool.query(sql, [
    title,
    description,
    price,
    location,
    now,
    category,
    state,
    idUser,
  ]);

  return created.insertId;
}

async function findProductsByUserId(idUser) {
  const pool = await getPool();
  const sql = `
  SELECT products.*, orders.status, orders.idUserBuyer FROM products 
  LEFT JOIN orders ON products.idProduct = orders.idProduct 
  WHERE idUser = ?
  `;
  const [products] = await pool.query(sql, idUser);
  return products;
}

async function findProductByidProduct(idProduct) {
  const pool = await getPool();
  const sql = 'SELECT * FROM products WHERE idProduct = ?';
  const [product] = await pool.query(sql, idProduct);

  return product[0];
}

async function updateProduct(idProduct, product) {
  const { title, description, price, location, category, state } = product;

  const now = new Date();
  const pool = await getPool();
  const sql = `
    UPDATE products SET title = ?, description = ?, price = ?, location = ?, category = ?, 
    state = ?, updatedAt = ? WHERE idProduct = ?`;
  const [result] = await pool.query(sql, [
    title,
    description,
    price,
    location,
    category,
    state,
    now,
    idProduct,
  ]);

  return result.affectedRows === 1;
}
async function removeProductById(idProduct) {
  const pool = await getPool();
  const sql = 'DELETE FROM products WHERE idProduct = ?';
  await pool.query(sql, idProduct);

  return true;
}

async function addToFavorites(idUser, idProduct) {
  const pool = await getPool();
  const sql = `INSERT
    INTO favorites (idUser, idProduct)
    VALUES (?, ?)`;
  const [created] = await pool.query(sql, [idUser, idProduct]);

  return created.insertId;
}

async function removeFromFavoritesByIds(idUser, idProduct) {
  const pool = await getPool();
  const sql = "DELETE FROM favorites WHERE idUser = ? && idProduct = ?";
  await pool.query(sql, [idUser, idProduct]);

  return true;
}

module.exports = {
  findAllProducts,
  addProduct,
  findProductsByUserId,
  updateProduct,
  findProductByidProduct,
  removeProductById,
  addToFavorites,
  removeFromFavoritesByIds,
};
