'use strict';

const getPool = require('../infrastructure/database-infrastructure');


async function findAllProducts() {
    const pool = await getPool();
    const sql = `SELECT * FROM products`;
    const [products] = await pool.query(sql);
    return products;
}


module.exports = {
    findAllProducts,
}