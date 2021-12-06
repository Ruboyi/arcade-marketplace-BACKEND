DROP DATABASE IF EXISTS arcade;
CREATE DATABASE arcade;
USE arcade;

CREATE TABLE users
(
  id_user INT NOT NULL auto_increment,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  password VARCHAR(120) NOT NULL,
  image VARCHAR(120),
  createdAt DATE NOT NULL,
  VerifiedAt DATE,
  updatedAt DATE,
  verificationCode VARCHAR(255),
  role enum('admin','user') default 'user' NOT NULL,
  PRIMARY KEY (id_user),
  UNIQUE (email)
);

CREATE TABLE products
(
  id_producto INT NOT NULL auto_increment,
  titulo VARCHAR(120) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  precio INT NOT NULL,
  localidad VARCHAR(120) NOT NULL,
  createdAt DATE NOT NULL,
  updatedAt DATE,
  timesVisited INT NOT NULL,
  id_user INT NOT NULL,
  PRIMARY KEY (id_producto),
  FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE TABLE reviews
(
  id_review INT NOT NULL auto_increment,
  comment VARCHAR(255),
  createdAt DATE NOT NULL,
  rating INT NOT NULL,
  user_valorador INT NOT NULL,
  id_user INT NOT NULL,
  PRIMARY KEY (id_review),
  FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE TABLE product_images
(
  id_image INT NOT NULL auto_increment,
  name_image VARCHAR(255) NOT NULL,
  principal boolean NOT NULL default false,
  id_producto INT NOT NULL,
  PRIMARY KEY (id_image),
  FOREIGN KEY (id_producto) REFERENCES products(id_producto)
);

CREATE TABLE favorites
(
  id_favorite INT NOT NULL auto_increment,
  id_user INT NOT NULL,
  id_producto INT NOT NULL,
  PRIMARY KEY (id_favorite),
  FOREIGN KEY (id_user) REFERENCES users(id_user),
  FOREIGN KEY (id_producto) REFERENCES products(id_producto),
  UNIQUE (id_user, id_producto)
);

CREATE TABLE reservas
(
  id_reserva INT NOT NULL auto_increment,
  id_producto INT NOT NULL,
  id_user INT NOT NULL,
  PRIMARY KEY (id_reserva),
  FOREIGN KEY (id_producto) REFERENCES products(id_producto),
  FOREIGN KEY (id_user) REFERENCES users(id_user),
  UNIQUE (id_producto, id_user)
);

CREATE TABLE vendidos
(
  id_venta INT NOT NULL auto_increment,
  date DATE NOT NULL,
  id_user INT NOT NULL,
  id_producto INT NOT NULL,
  PRIMARY KEY (id_venta),
  FOREIGN KEY (id_user) REFERENCES users(id_user),
  FOREIGN KEY (id_producto) REFERENCES products(id_producto),
  UNIQUE (id_user, id_producto)
);


