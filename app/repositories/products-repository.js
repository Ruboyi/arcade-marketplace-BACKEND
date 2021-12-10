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
  const [created] = await pool.query(sql, [title, description, price, location, now, category, state, idUser]);

  return created.insertId;
}

async function findProductsByUserId(idUser) {
  const pool = await getPool();
  const sql = `
  SELECT products.*, orders.status FROM products 
  INNER JOIN orders ON products.idProduct = orders.idProduct 
  WHERE id = ?
  `;
  const [products] = await pool.query(sql, idUser);
  return products;
}

module.exports = {
  findAllProducts,
  addProduct,
  findProductsByUserId,
};
