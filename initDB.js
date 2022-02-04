'use strict';
require('dotenv').config();
const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');
const getPool = require('./app/infrastructure/database-infrastructure');

const { HTTP_SERVER, PATH_USER_IMAGE } = process.env;

const usersArray = [
  'Elsa_12367',
  'Ruben',
  'Aaron',
  'Nacho',
  'Messi',
  'Salva',
  'Stefano',
  'Rick',
  'Dani',
  'pepe'
];

let connection;
async function initDB() {
  try {
    connection = await getPool();
    // drop and create database arcade
    await connection.query('DROP DATABASE IF EXISTS arcade');
    await connection.query(
      'CREATE DATABASE IF NOT EXISTS arcade DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci'
    );
    // use database arcade
    await connection.query('USE arcade');
    // delete pre-existing tables
    await connection.query('DROP TABLE IF EXISTS favorites');
    await connection.query('DROP TABLE IF EXISTS orders');
    await connection.query('DROP TABLE IF EXISTS productReports');
    await connection.query('DROP TABLE IF EXISTS productImages');
    await connection.query('DROP TABLE IF EXISTS products');
    await connection.query('DROP TABLE IF EXISTS reviews');
    await connection.query('DROP TABLE IF EXISTS users');

    // create table users
    await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
        idUser INT NOT NULL AUTO_INCREMENT,
        nameUser VARCHAR(120) NOT NULL,
        email VARCHAR(120) NOT NULL,
        password VARCHAR(120) NOT NULL,
        image VARCHAR(120) NULL DEFAULT NULL,
        phone VARCHAR(120) NULL DEFAULT NULL,
        bio VARCHAR(120) NULL DEFAULT NULL,
        createdAt DATE NOT NULL,
        verifiedAt DATE NULL DEFAULT NULL,
        updatedAt DATE NULL DEFAULT NULL,
        verificationCode VARCHAR(255) NULL DEFAULT NULL,
        role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        PRIMARY KEY (idUser))
    `);
    // create table products
    await connection.query(`
    CREATE TABLE IF NOT EXISTS products (
        idProduct INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(120) NOT NULL,
        description VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        location VARCHAR(120) NOT NULL,
        createdAt DATE NOT NULL,
        updatedAt DATE NULL DEFAULT NULL,
        category ENUM('consolas', 'videojuegos', 'accesorios', 'arcades') NOT NULL,
        state ENUM('nuevo', 'seminuevo', 'usado') NOT NULL,
        timesVisited INT NOT NULL DEFAULT 0,
        idUser INT NOT NULL,
        PRIMARY KEY (idProduct),
        INDEX idUser (idUser ASC) VISIBLE,
        CONSTRAINT products_ibfk_1
        FOREIGN KEY (idUser)
        REFERENCES arcade.users (idUser)
        ON DELETE CASCADE)
    `);
    // create table favorites
    await connection.query(`
    CREATE TABLE IF NOT EXISTS favorites (
        idFavorite INT NOT NULL AUTO_INCREMENT,
        idUser INT NOT NULL,
        idProduct INT NOT NULL,
        PRIMARY KEY (idFavorite),
        INDEX idUser (idUser ASC) VISIBLE,
        INDEX idProduct (idProduct ASC) VISIBLE,
        CONSTRAINT favorites_ibfk_1
          FOREIGN KEY (idUser)
          REFERENCES arcade.users (idUser),
        CONSTRAINT favorites_ibfk_2
          FOREIGN KEY (idProduct)
          REFERENCES arcade.products (idProduct))
    `);
    // create table orders
    await connection.query(`
    CREATE TABLE IF NOT EXISTS orders (
        idOrder INT NOT NULL AUTO_INCREMENT,
        idUserBuyer INT NOT NULL,
        idProduct INT NOT NULL,
        orderDate DATE NOT NULL,
        status ENUM('solicitado', 'rechazado', 'reservado', 'vendido') NOT NULL DEFAULT 'solicitado',
        isChecked TINYINT(1) NOT NULL DEFAULT '0',
        orderSubject VARCHAR(120) NULL DEFAULT NULL,
        orderMessage VARCHAR(255) NULL DEFAULT NULL,
        orderTypeOfContact ENUM('phone', 'email') NULL DEFAULT 'email',
        reservationDate DATE NULL DEFAULT NULL,
        saleDate DATE NULL DEFAULT NULL,
        saleLocation VARCHAR(255) NULL DEFAULT NULL,
        saleMessage VARCHAR(255) NULL DEFAULT NULL,
        saleTypeOfContact ENUM('phone', 'email') NULL DEFAULT 'email',
        PRIMARY KEY (idOrder),
        INDEX idUserBuyer (idUserBuyer ASC) VISIBLE,
        INDEX idProduct (idProduct ASC) VISIBLE,
        CONSTRAINT orders_ibfk_1
          FOREIGN KEY (idUserBuyer)
          REFERENCES arcade.users (idUser) ON DELETE CASCADE,
        CONSTRAINT orders_ibfk_2
          FOREIGN KEY (idProduct)
          REFERENCES arcade.products (idProduct))
    `);
    // create table productImages
    await connection.query(`
    CREATE TABLE IF NOT EXISTS productImages (
        idImage INT NOT NULL AUTO_INCREMENT,
        nameImage VARCHAR(255) NOT NULL,
        mainImage TINYINT(1) NOT NULL DEFAULT '0',
        idProduct INT NOT NULL,
        PRIMARY KEY (idImage),
        INDEX idProduct (idProduct ASC) VISIBLE,
        CONSTRAINT productImages_ibfk_1
          FOREIGN KEY (idProduct)
          REFERENCES arcade.products (idProduct)
          ON DELETE CASCADE)
    `);
    // create table productReports
    await connection.query(`
    CREATE TABLE IF NOT EXISTS productReports (
        idProductReport INT NOT NULL AUTO_INCREMENT,
        reason ENUM('1', '2', '3', '4') NULL DEFAULT NULL,
        reportDate DATE NOT NULL,
        isChecked TINYINT(1) NOT NULL DEFAULT '0',
        idUser INT NOT NULL,
        idProduct INT NOT NULL,
        PRIMARY KEY (idProductReport),
        INDEX idUser (idUser ASC) VISIBLE,
        INDEX idProduct (idProduct ASC) VISIBLE,
        CONSTRAINT productReports_ibfk_1
          FOREIGN KEY (idUser)
          REFERENCES arcade.users (idUser),
        CONSTRAINT productReports_ibfk_2
          FOREIGN KEY (idProduct)
          REFERENCES arcade.products (idProduct))
    `);
    // create table reviews
    await connection.query(`
    CREATE TABLE IF NOT EXISTS reviews (
        idReview INT NOT NULL AUTO_INCREMENT,
        opinion VARCHAR(255) NULL DEFAULT NULL,
        createdAt DATE NOT NULL,
        rating INT NOT NULL,
        isChecked TINYINT(1) NOT NULL DEFAULT '0',
        isSeller TINYINT(1) NOT NULL,
        idUserReviewer INT NOT NULL,
        idUser INT NOT NULL,
        PRIMARY KEY (idReview),
        INDEX idUser (idUser ASC) VISIBLE,
        CONSTRAINT reviews_ibfk_1
          FOREIGN KEY (idUser)
          REFERENCES arcade.users (idUser))
    `);
    console.log('DB restarted');

    // generate 10 users - (usersArray)
    console.log('Creating 10 users...');

    const avatarsArray = [
      `${HTTP_SERVER}/${PATH_USER_IMAGE}/1-asdasdasd.png`,
      `${HTTP_SERVER}/${PATH_USER_IMAGE}/2-asdasdasd.png`,
      `${HTTP_SERVER}/${PATH_USER_IMAGE}/3-asdasdasd.png`,
      `${HTTP_SERVER}/${PATH_USER_IMAGE}/4-asdasdasd.png`,
      `${HTTP_SERVER}/${PATH_USER_IMAGE}/5-asdasdasd.png`,
      `${HTTP_SERVER}/${PATH_USER_IMAGE}/6-asdasdasd.png`,
      `${HTTP_SERVER}/${PATH_USER_IMAGE}/7-asdasdasd.png`,
      `${HTTP_SERVER}/${PATH_USER_IMAGE}/8-asdasdasd.png`,
      `${HTTP_SERVER}/${PATH_USER_IMAGE}/9-asdasdasd.png`,
      `${HTTP_SERVER}/${PATH_USER_IMAGE}/10-asdasdasd.png`
    ];

    for (let i = 0; i < usersArray.length; i++) {
      let name = usersArray[i];
      let email = `${usersArray[i]}@yopmail.com`;
      const password = '123456';
      const passwordHash = await bcrypt.hash(password, 12);
      const image = avatarsArray[i];

      const now = new Date().toISOString();
      const mySQLDateString = now.slice(0, 19).replace('T', ' ');
      const verificationCode = randomstring.generate(64);

      // insert user
      await connection.query(`
        INSERT INTO users(nameUser, email, password, image, createdAt, verifiedAt, verificationCode, role) 
        VALUES (
            "${name}",
            "${email}",
            "${passwordHash}",
            "${image}",
            "${mySQLDateString}",
            "${mySQLDateString}",
            "${verificationCode}",
            "user"
        )
        `);
    }

    // generate 20 products
    console.log('Creating 20 products...');

    await connection.query(`
    INSERT INTO products(
      title,
      description,
      price,
      location,
      createdAt,
      category,
      state,
      idUser
      )
    VALUES(
          'Nintendo 64',
          'La nintendo está bien',
          '50',
          'A Coruña',
          '2021-12-28 12:16:42',
          'consolas',
          'seminuevo',
          '1'
      ),
      (
          'GameCube',
          'La GameCube está como nueva',
          '30',
          'A Coruña',
          '2021-12-28 12:16:42',
          'consolas',
          'seminuevo',
          '2'
      ),
      (
          'Mando Play Station 1',
          'Funciona bien',
          '20',
          'A Coruña',
          '2021-12-20 12:16:42',
          'accesorios',
          'seminuevo',
          '4'
      ),
      (
          'Super Mario Bros',
          'esta bueno',
          '75',
          'A Coruña',
          '2021-12-25 12:16:42',
          'videojuegos',
          'usado',
          '4'
      ),
      (
          'DOOM',
          'esta bueno',
          '15',
          'A Coruña',
          '2021-12-25 12:16:42',
          'videojuegos',
          'usado',
          '8'
      ),
      (
          'CRASH',
          'esta bueno',
          '27',
          'A Coruña',
          '2021-12-25 12:16:42',
          'videojuegos',
          'usado',
          '9'
      ),
      (
          'NINTENDO 64',
          'nueva sin abrir',
          '150',
          'Madrid',
          '2021-12-24 12:16:42',
          'consolas',
          'nuevo',
          '7'
      ),
      (
          'PINBALL',
          'funciona perfectamente',
          '450',
          'Carral',
          '2021-12-13 12:16:42',
          'arcades',
          'usado',
          '6'
      ),
      (
          'SNES',
          'como nueva',
          '105',
          'Ferrol',
          '2021-12-24 12:16:42',
          'consolas',
          'seminuevo',
          '2'
      ),
      (
          'PAC MAN ARCADE',
          'en perfecto estado, version original',
          '501',
          'A Coruña',
          '2021-12-24 12:16:42',
          'arcades',
          'usado',
          '5'
      ),
      (
        'GAME BOY',
        'Como nueva incluidos 2 juegos',
        '60',
        'A Coruña',
        '2021-12-24 12:16:42',
        'consolas',
        'usado',
        '2'
      ),
      (
        'PS2',
        'Un poco arañada en un filo pero funciona perfectamente',
        '80',
        'A Coruña',
        '2021-12-24 12:16:42',
        'consolas',
        'usado',
        '3'
      ),
      (
        'POKEMON CRYSTAL GBcolor',
        'Un clasico de los pokemos en mi opinion el mejor',
        '15',
        'A Coruña',
        '2021-12-24 12:16:42',
        'videojuegos',
        'usado',
        '4'
      ),
      (
        'MANDO DE N64',
        'Nuevo sin usar en su caja original',
        '25',
        'A Coruña',
        '2021-12-24 12:16:42',
        'accesorios',
        'nuevo',
        '5'
      ),
      (
        'ARCADE',
        'Esta usado pero funciona bien',
        '25',
        'A Coruña',
        '2021-12-24 12:16:42',
        'arcades',
        'seminuevo',
        '6'
      ),
      (
        'DREAMCAST',
        'Funciona como el primer dia, que pena que ya no la fabriquen ',
        '25',
        'A Coruña',
        '2021-12-24 12:16:42',
        'consolas',
        'seminuevo',
        '7'
      ),
      (
        'Lote de 6 Videjuegos de SUPER NESS',
        'Clasicos de la mejor consola que ha existido nunca ',
        '50',
        'A Coruña',
        '2021-12-24 12:16:42',
        'videojuegos',
        'seminuevo',
        '8'
      ),
      (
        'GTA2 PS one',
        'Donde empezo todo del mundo gta, horas y horas de diviersión me ha dado este clasico',
        '25',
        'A Coruña',
        '2021-12-24 12:16:42',
        'videojuegos',
        'seminuevo',
        '9'
      ),
      (
        'SUPER Mario 64',
        'Primer juego de mario en 3D, si te gusta el mundo de super mario deberias probar sus origenes',
        '10',
        'A Coruña',
        '2021-12-24 12:16:42',
        'videojuegos',
        'seminuevo',
        '10'
      )
      
    `);

    // generate 20 product images
    console.log('Creating 20 products images...');

    const initialImages = [
      'nintendo.jpg',
      'gamecube.jpg',
      'mandops1.jpg',
      'supermariobros.jpg',
      'doom.jpg',
      'crash.png',
      'nintendo64.jpg',
      'pinball.jpg',
      'snes.jpg',
      'pacman.jpg',
      'gameboy.jpg',
      'ps2.jpeg',
      'pokemoncrystal.jpg',
      'mandoN64.jpg',
      'arcade2.jpg',
      'dreamcast.jpg',
      'lotesuperness.jpg',
      'gta2.jpg',
      'mario64.jpg'
    ];

    for (let i = 0; i < initialImages.length; i++) {
      await connection.query(`
      INSERT INTO productImages(
        nameImage,
        mainImage,
        idProduct
        )
        VALUES(
          '${initialImages[i]}',
          1,
          ${i + 1}          
          )
          `);
    }

    await connection.query(`
    INSERT INTO productImages(
      nameImage,
      mainImage,
      idProduct
      )
      VALUES(
        'nintendo64caja.png',
        0,
        1          
        )
        `);

    // generate 10 purchase orders
    console.log('Creating 10 purchase orders...');

    await connection.query(`
    INSERT INTO orders(
      idUserBuyer,
      idProduct,
      orderDate,
      orderSubject,
      orderMessage,
      orderTypeOfContact
    ) VALUES
    (
      1,
      3,
      '2021-12-24 12:16:42',
      'Me gusta, lo quiero ya',
      'Cuando podes quedar? lo quiero lo antes posible',
      'phone'
    ),
    (
      2,
      7,
      '2021-12-29 12:16:42',
      'esta bueno',
      'quiero verlo en persona',
      'email'
    ),
    (
      4,
      10,
      '2022-01-04 12:16:42',
      'Te lo compro',
      'Te lo compro pero a 20 euros',
      'email'
    ),
    (
      2,
      8,
      '2022-01-07 12:16:42',
      'aguante boca',
      'me da igual el producto, aguante boca',
      'email'
    ),
    (
      3,
      2,
      '2022-01-15 12:16:42',
      'nice',
      'me interesa, trabajo por las tardes, tu puedes quedar a la mañana?',
      'phone'
    ),
    (
      10,
      4,
      '2022-01-02 12:16:42',
      'tiene buena pinta',
      'tenes mas fotos? mandamelas al email! pepe@yopmail.com',
      'email'
    ),
    (
      1,
      9,
      '2021-12-29 12:16:42',
      'lo quiero ya',
      'Cuando podes quedar? lo quiero lo antes posible',
      'phone'
    ),
    (
      5,
      9,
      '2022-01-14 12:16:42',
      'sisi',
      'sisi, parece bueno, te doy 50 euros',
      'email'
    ),
    (
      6,
      4,
      '2022-01-19 12:16:42',
      'apa, nice',
      'te puedo pagar con pesos uruguayos?',
      'email'
    ),
    (
      9,
      4,
      '2022-01-21 12:16:42',
      'ia tu sabe',
      'cuanto me saldria el combo por el juego y un cafe juntos?',
      'phone'
    )
    `);

    // accepting 4 of them
    await connection.query(`
    UPDATE orders
      SET status = 'reservado',
        reservationDate = '2022-01-07 12:16:42',
        saleDate = '2022-01-09 12:16:42',
        saleLocation = 'plaza pontevedra, a coruña',
        saleMessage = 'lleva el dinero justo y no perdamos el tiempo',
        saleTypeOfContact = 'phone'
    WHERE idProduct = 3 && idUserBuyer = 1
    `);
    await connection.query(`
    UPDATE orders
      SET status = 'reservado',
        reservationDate = '2022-01-20 12:16:42',
        saleDate = '2022-02-24 12:16:42',
        saleLocation = 'plaza de vigo, a coruña',
        saleMessage = 'llego una chaqueta azul para que me reconozcas',
        saleTypeOfContact = 'email'
    WHERE idProduct = 2 && idUserBuyer = 3
    `);
    await connection.query(`
    UPDATE orders
      SET status = 'reservado',
        reservationDate = '2022-01-25 12:16:42',
        saleDate = '2022-02-17 12:16:42',
        saleLocation = 'en lo de tu abuela',
        saleMessage = 'cuando estes llegando avisame y te abro la puerta',
        saleTypeOfContact = 'phone'
    WHERE idProduct = 10 && idUserBuyer = 4
    `);
    await connection.query(`
    UPDATE orders
      SET status = 'reservado',
        reservationDate = '2022-01-20 12:16:42',
        saleDate = '2022-01-25 12:16:42',
        saleLocation = 'atocha, madrid',
        saleMessage = 'frente al cafe ese, llega puntual',
        saleTypeOfContact = 'phone'
    WHERE idProduct = 8 && idUserBuyer = 2
    `);

    // rejecting 1 of them
    await connection.query(`
    UPDATE orders
      SET status = 'rechazado'
    WHERE idProduct = 7 && idUserBuyer = 2
    `);

    // ---------------------------------------------------------
    console.log('DB arcade created');
    // ---------------------------------------------------------
  } catch (error) {
    console.log(error);
  } finally {
    process.exit(0);
  }
}

initDB();
