'use strict';

const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');
const {
    findImagesByProductId
} = require('../../repositories/product-images-repository');
const { findAllNewProducts
} = require('../../repositories/products-repository');

async function getAllNewProducts(req, res) {
    try {
        const products = await findAllNewProducts();
        if (products.length === 0) {
            throwJsonError(400, 'Productos no encontrados');
        }

        const images = [];

        for (const product of products) {
            images.push(await findImagesByProductId(product.idProduct));
        }

        const mapperProductWithImages = products.map((productData, index) => {
            const { idProduct, ...rest } = productData;

            return {
                idProduct,
                ...rest,
                images: images[index]
            };
        });

        res.status(200);
        res.send({ data: mapperProductWithImages });
    } catch (error) {
        createJsonError(error, res);
    }
}

module.exports = getAllNewProducts;