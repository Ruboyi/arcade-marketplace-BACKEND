'use strict';

const getPool = require('../infrastructure/database-infrastructure');

async function addImageByProductId (idProduct, nameImage, mainImage = 0) {
    const pool = await getPool();
    const now = new Date();
    const sql = `INSERT INTO productImages(
        nameImage,
        mainImage,
        idProduct) VALUES ( ?, ?, ?)`;
    const [products] = await pool.query(sql, [nameImage, mainImage ? 1 : 0, idProduct]);

    return true;
}

async function removeMainImageByidProduct(idProduct) {
    const pool = await getPool();
    const sql = `
    UPDATE productImages
      SET principal = 0
      WHERE idProduct = ?
    `;
    const [result] = await pool.query(sql, idProduct);
  
    return (result.affectedRows === 1);
}

async function findImagesByProductId(idProduct) {
    const pool = await getPool();
    const sql = `SELECT * FROM productImages WHERE idProduct = ?`;
    const [images] = await pool.query(sql, idProduct);
  
    return images;
}


module.exports = {
    addImageByProductId,
    removeMainImageByidProduct,
    findImagesByProductId
}