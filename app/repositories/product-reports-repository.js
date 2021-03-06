"use strict";

const getPool = require("../infrastructure/database-infrastructure");

async function addProductReport(productReport) {
  const pool = await getPool();
  const now = new Date();
  const { reason, description, isChecked, idUser, idProduct } = productReport;
  const sql = `INSERT INTO productReports (
        reason,
        description,
        reportDate,
        isChecked,
        idUser,
        idProduct
    ) VALUES(?, ?, ?, ?, ?, ?)`;
  const [created] = await pool.query(sql, [
    reason,
    description,
    now,
    isChecked,
    idUser,
    idProduct,
  ]);

  return created.insertId;
}

async function findAllProductsReports() {
  const pool = await getPool();
  const sql =
    "SELECT idProductReport as id, reason, description, reportDate, idUser, idProduct FROM productReports";
  const [reports] = await pool.query(sql);

  return reports;
}

async function removeProductReportById(id) {
  const pool = await getPool();
  const sql = "DELETE from productReports WHERE idProductReport = ?";
  await pool.query(sql, id);

  return true;
}

module.exports = {
  addProductReport,
  findAllProductsReports,
  removeProductReportById,
};
