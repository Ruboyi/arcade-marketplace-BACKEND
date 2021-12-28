'use strict';
require('dotenv').config();
const bcrypt = require('bcryptjs');
const faker = require('faker');
const randomstring = require('randomstring');
const getPool = require('./app/infrastructure/database-infrastructure');

// number of random users
const users = 10;

let connection;
async function initDB() {
  try {
    connection = await getPool();
    // drop and create database arcade
    await connection.query('DROP DATABASE IF EXISTS arcade');
    await connection.query('CREATE DATABASE IF NOT EXISTS arcade DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci');
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
        idOrders INT NOT NULL AUTO_INCREMENT,
        idUserBuyer INT NOT NULL,
        idProduct INT NOT NULL,
        orderDate DATE NOT NULL,
        status ENUM('solicitado', 'rechazado', 'reservado', 'vendido') NOT NULL DEFAULT 'solicitado',
        orderSubject VARCHAR(120) NULL DEFAULT NULL,
        orderMessage VARCHAR(255) NULL DEFAULT NULL,
        orderTypeOfContact ENUM('phone', 'email') NOT NULL,
        reservationDate DATE NOT NULL,
        saleDate DATE NOT NULL,
        saleLocation VARCHAR(255) NOT NULL,
        saleMessage VARCHAR(255) NULL DEFAULT NULL,
        saleTypeOfContact ENUM('phone', 'email') NOT NULL,
        PRIMARY KEY (idOrders),
        INDEX idUserBuyer (idUserBuyer ASC) VISIBLE,
        INDEX idProduct (idProduct ASC) VISIBLE,
        CONSTRAINT orders_ibfk_1
          FOREIGN KEY (idUserBuyer)
          REFERENCES arcade.users (idUser),
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

    // generate random users
    console.log('Creating random users...');

    for (let i = 0; i < users; i++) {
      const name = faker.name.firstName();
      const number = '123';
      const domain = 'yopmail.com';
      const email = faker.internet.email(name, number, domain);
      const password = '123456';
      const passwordHash = await bcrypt.hash(password, 12);
      const image = 'https://thispersondoesnotexist.com/image';

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

    // generate 10 products
    console.log('Creating products...');
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
      )
    `);

    // generate 10 purchase orders
    //
    //
    //

    console.log('DB arcade created');
  } catch (error) {
    console.log(error);
  } finally {
    process.exit(0);
  }
}

initDB();
