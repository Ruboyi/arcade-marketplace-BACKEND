"use strict";

const getPool = require("../infrastructure/database-infrastructure");

async function addProductReport(productReport) {
  const pool = await getPool();
  const now = new Date();
  const { reason, isChecked, idUser, idProduct } = productReport;
  const sql = `INSERT INTO productReports (
        reason,
        reportDate,
        isChecked,
        idUser,
        idProduct
    ) VALUES(?, ?, ?, ?, ?)`;
  const [created] = await pool.query(sql, [
    reason,
    now,
    isChecked,
    idUser,
    idProduct,
  ]);

  return created.insertId;
}

async function findAllProductsReports() {
  const pool = await getPool();
  const sql = "SELECT * FROM productReports";
  const [reports] = await pool.query(sql);

  return reports;
}

module.exports = {
  addProductReport,
  findAllProductsReports,
};
