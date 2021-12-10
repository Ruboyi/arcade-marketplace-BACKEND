'use strict';

const getPool = require('../infrastructure/database-infrastructure');

async function findAllOrdersByProductId(idProduct) {
    const pool = await getPool();
    const sql = `SELECT * FROM orders WHERE idProduct = ?`;
    const [orders] = await pool.query(sql, idProduct);
    return orders;
}

module.exports = {
    findAllOrdersByProductId,
  };