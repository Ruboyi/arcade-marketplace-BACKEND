-- ARCADE MARKETPLACE DATABASE
-- -----------------------------------------------------

DROP DATABASE IF EXISTS arcade;
CREATE DATABASE arcade;
USE arcade;

CREATE TABLE users
(
  idUser INT NOT NULL auto_increment,
  nameUser VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  password VARCHAR(120) NOT NULL,
  image VARCHAR(120),
  phone varchar(120),
  createdAt DATE NOT NULL,
  verifiedAt DATE,
  updatedAt DATE,
  verificationCode VARCHAR(255),
  role enum('admin','user') default 'user' NOT NULL,
  PRIMARY KEY (idUser),
);

CREATE TABLE products
(
  idProduct INT NOT NULL auto_increment,
  title VARCHAR(120) NOT NULL,
  description VARCHAR(255) NOT NULL,
  price decimal NOT NULL,
  location VARCHAR(120) NOT NULL,
  createdAt DATE NOT NULL,
  updatedAt DATE,
  category enum('consolas','videojuegos','accesorios','arcades') not null,
  state enum('nuevo','seminuevo','usado') not null,
  timesVisited INT NOT NULL,
  idUser INT NOT NULL,
  PRIMARY KEY (idProduct),
  FOREIGN KEY (idUser) REFERENCES users(idUser)
);

CREATE TABLE reviews
(
  idReview INT NOT NULL auto_increment,
  opinion VARCHAR(255),
  createdAt DATE NOT NULL,
  rating INT NOT NULL,
  isSeller boolean not null,
  idUserReviewer int NOT NULL,
  idUser INT NOT NULL,
  PRIMARY KEY (idReview),
  FOREIGN KEY (idUser) REFERENCES users(idUser)
);	

CREATE TABLE productImages
(
  idImage INT NOT NULL auto_increment,
  nameImage VARCHAR(255) NOT NULL,
  mainImage boolean NOT NULL default false,
  idProduct INT NOT NULL,
  PRIMARY KEY (idImage),
  FOREIGN KEY (idProduct) REFERENCES products(idProduct)
);

CREATE TABLE favorites
(
  idFavorite INT NOT NULL auto_increment,
  idUser INT NOT NULL,
  idProduct INT NOT NULL,
  PRIMARY KEY (idFavorite),
  FOREIGN KEY (idUser) REFERENCES users(idUser),
  FOREIGN KEY (idProduct) REFERENCES products(idProduct)
);

CREATE TABLE productReports
(
	idProductReport int not null auto_increment,
	reason enum('1','2','3','4'),
    idUser int not null,
    idProduct int not null,
    PRIMARY KEY (idProductReport),
	FOREIGN KEY (idUser) REFERENCES users(idUser),
	FOREIGN KEY (idProduct) REFERENCES products(idProduct)
);

CREATE TABLE purchaseOrders
(	
	idOrder int not null auto_increment,
    orderDate date not null,
    idUser int not null,
    idProduct int not null,
	orderSubject varchar(120),
    orderMessage varchar(255),
    orderTypeOfContact enum('phone','email') not null,
    orderContact varchar(120) not null,
    accepted boolean not null default false,
    PRIMARY KEY (idOrder),
	FOREIGN KEY (idUser) REFERENCES users(idUser),
	FOREIGN KEY (idProduct) REFERENCES products(idProduct)
);


CREATE TABLE sales
(
	idSale int not null auto_increment,
    reservationDate date not null,
    idUser int not null,
    idProduct int not null,
    saleDate date not null,
    saleLocation varchar(255) not null,
    saleMessage varchar(255),
    saleTypeOfContact enum('phone','email') not null,
    saleContact varchar(120) not null,
    sold boolean not null default false,
    PRIMARY KEY (idSale),
    FOREIGN KEY (idUser) REFERENCES users(idUser),
	FOREIGN KEY (idProduct) REFERENCES products(idProduct)
);
