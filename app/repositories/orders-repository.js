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

async function acceptOrder(saleData, idProduct, idUserBuyer) {
  const pool = await getPool();
  const now = new Date();
  const { saleDate, saleLocation, saleMessage, saleTypeOfContact } = saleData;
  const sql = `
    UPDATE orders
      SET status = 'reservado',
        reservationDate = ?,
        saleDate = ?,
        saleLocation = ?,
        saleMessage = ?,
        saleTypeOfContact = ?
    WHERE idProduct = ? && idUserBuyer = ?
  `;
  const [updated] = await pool.query(sql, [
    now,
    saleDate,
    saleLocation,
    saleMessage,
    saleTypeOfContact,
    idProduct,
    idUserBuyer,
  ]);

  return updated.affectedRows === 1;
}

module.exports = {
  findAllOrdersByProductId,
  findAllOrdersByUserBuyerId,
  addOrder,
  acceptOrder,
};
