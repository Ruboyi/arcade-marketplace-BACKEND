'use strict';

const getPool = require('../infrastructure/database-infrastructure');

async function findAllOrdersByProductId(idProduct) {
  const pool = await getPool();
  const sql = 'SELECT * FROM orders WHERE idProduct = ?';
  const [orders] = await pool.query(sql, idProduct);

  return orders;
}

async function findAllOrdersByUserBuyerId(idUserBuyer) {
  const pool = await getPool();
  const sql = 'SELECT * FROM orders WHERE idUserBuyer = ?';
  const [orders] = await pool.query(sql, idUserBuyer);

  return orders;
}

async function addOrder(purchaseOrder) {
  const pool = await getPool();
  const now = new Date();
  const { idUserBuyer, idProduct, orderSubject, orderMessage, orderTypeOfContact } = purchaseOrder;
  const sql = `INSERT INTO orders(
      idUserBuyer,
      idProduct,
      orderDate,
      orderSubject,
      orderMessage,
      orderTypeOfContact
  ) VALUES(
    ?, ?, ?, ?, ?, ?
  )`;
  const [created] = await pool.query(sql, [
    idUserBuyer,
    idProduct,
    now,
    orderSubject,
    orderMessage,
    orderTypeOfContact,
  ]);

  return created.insertId;
}

module.exports = {
  findAllOrdersByProductId,
  findAllOrdersByUserBuyerId,
  addOrder,
};
