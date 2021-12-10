-- -----------------------------------------------------
-- Schema arcade
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `arcade` ;

-- -----------------------------------------------------
-- Schema arcade
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `arcade` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `arcade` ;

-- -----------------------------------------------------
-- Table `arcade`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `arcade`.`users` ;

CREATE TABLE IF NOT EXISTS `arcade`.`users` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `nameUser` VARCHAR(120) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `password` VARCHAR(120) NOT NULL,
  `image` VARCHAR(120) NULL DEFAULT NULL,
  `phone` VARCHAR(120) NULL DEFAULT NULL,
  `createdAt` DATE NOT NULL,
  `verifiedAt` DATE NULL DEFAULT NULL,
  `updatedAt` DATE NULL DEFAULT NULL,
  `verificationCode` VARCHAR(255) NULL DEFAULT NULL,
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `arcade`.`products`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `arcade`.`products` ;

CREATE TABLE IF NOT EXISTS `arcade`.`products` (
  `idProduct` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(120) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `location` VARCHAR(120) NOT NULL,
  `createdAt` DATE NOT NULL,
  `updatedAt` DATE NULL DEFAULT NULL,
  `category` ENUM('consolas', 'videojuegos', 'accesorios', 'arcades') NOT NULL,
  `state` ENUM('nuevo', 'seminuevo', 'usado') NOT NULL,
  `timesVisited` INT NOT NULL,
  `idUser` INT NOT NULL,
  PRIMARY KEY (`idProduct`),
  INDEX `idUser` (`idUser` ASC) VISIBLE,
  CONSTRAINT `products_ibfk_1`
    FOREIGN KEY (`idUser`)
    REFERENCES `arcade`.`users` (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `arcade`.`favorites`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `arcade`.`favorites` ;

CREATE TABLE IF NOT EXISTS `arcade`.`favorites` (
  `idFavorite` INT NOT NULL AUTO_INCREMENT,
  `idUser` INT NOT NULL,
  `idProduct` INT NOT NULL,
  PRIMARY KEY (`idFavorite`),
  INDEX `idUser` (`idUser` ASC) VISIBLE,
  INDEX `idProduct` (`idProduct` ASC) VISIBLE,
  CONSTRAINT `favorites_ibfk_1`
    FOREIGN KEY (`idUser`)
    REFERENCES `arcade`.`users` (`idUser`),
  CONSTRAINT `favorites_ibfk_2`
    FOREIGN KEY (`idProduct`)
    REFERENCES `arcade`.`products` (`idProduct`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `arcade`.`orders`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `arcade`.`orders` ;

CREATE TABLE IF NOT EXISTS `arcade`.`orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idUserBuyer` INT NOT NULL,
  `idProduct` INT NOT NULL,
  `orderDate` DATE NOT NULL,
  `status` ENUM('solicitado', 'rechazado', 'reservado', 'vendido') NOT NULL DEFAULT 'solicitado',
  `orderSubject` VARCHAR(120) NULL DEFAULT NULL,
  `orderMessage` VARCHAR(255) NULL DEFAULT NULL,
  `orderTypeOfContact` ENUM('phone', 'email') NOT NULL,
  `reservationDate` DATE NOT NULL,
  `saleDate` DATE NOT NULL,
  `saleLocation` VARCHAR(255) NOT NULL,
  `saleMessage` VARCHAR(255) NULL DEFAULT NULL,
  `saleTypeOfContact` ENUM('phone', 'email') NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idUserBuyer` (`idUserBuyer` ASC) VISIBLE,
  INDEX `idProduct` (`idProduct` ASC) VISIBLE,
  CONSTRAINT `orders_ibfk_1`
    FOREIGN KEY (`idUserBuyer`)
    REFERENCES `arcade`.`users` (`idUser`),
  CONSTRAINT `orders_ibfk_2`
    FOREIGN KEY (`idProduct`)
    REFERENCES `arcade`.`products` (`idProduct`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `arcade`.`productImages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `arcade`.`productImages` ;

CREATE TABLE IF NOT EXISTS `arcade`.`productImages` (
  `idImage` INT NOT NULL AUTO_INCREMENT,
  `nameImage` VARCHAR(255) NOT NULL,
  `mainImage` TINYINT(1) NOT NULL DEFAULT '0',
  `idProduct` INT NOT NULL,
  PRIMARY KEY (`idImage`),
  INDEX `idProduct` (`idProduct` ASC) VISIBLE,
  CONSTRAINT `productImages_ibfk_1`
    FOREIGN KEY (`idProduct`)
    REFERENCES `arcade`.`products` (`idProduct`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `arcade`.`productReports`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `arcade`.`productReports` ;

CREATE TABLE IF NOT EXISTS `arcade`.`productReports` (
  `idProductReport` INT NOT NULL AUTO_INCREMENT,
  `reason` ENUM('1', '2', '3', '4') NULL DEFAULT NULL,
  `idUser` INT NOT NULL,
  `idProduct` INT NOT NULL,
  PRIMARY KEY (`idProductReport`),
  INDEX `idUser` (`idUser` ASC) VISIBLE,
  INDEX `idProduct` (`idProduct` ASC) VISIBLE,
  CONSTRAINT `productReports_ibfk_1`
    FOREIGN KEY (`idUser`)
    REFERENCES `arcade`.`users` (`idUser`),
  CONSTRAINT `productReports_ibfk_2`
    FOREIGN KEY (`idProduct`)
    REFERENCES `arcade`.`products` (`idProduct`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `arcade`.`reviews`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `arcade`.`reviews` ;

CREATE TABLE IF NOT EXISTS `arcade`.`reviews` (
  `idReview` INT NOT NULL AUTO_INCREMENT,
  `opinion` VARCHAR(255) NULL DEFAULT NULL,
  `createdAt` DATE NOT NULL,
  `rating` INT NOT NULL,
  `isSeller` TINYINT(1) NOT NULL,
  `idUserReviewer` INT NOT NULL,
  `idUser` INT NOT NULL,
  PRIMARY KEY (`idReview`),
  INDEX `idUser` (`idUser` ASC) VISIBLE,
  CONSTRAINT `reviews_ibfk_1`
    FOREIGN KEY (`idUser`)
    REFERENCES `arcade`.`users` (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
