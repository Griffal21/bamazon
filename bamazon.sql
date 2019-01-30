DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
  item_id INTEGER (225) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(225) NOT NULL,
  department_name VARCHAR(225) NOT NULL,
  price DECIMAL(65,2) NOT NULL,
  stock_quantity INTEGER(99) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
-- store inventory is in prime numbers
  ("Propane", "Propane and Propane Accessories", 2.36, 997),
  ("20 lb Propane Tank", "Propane and Propane Accessories", 29.99, 479),
  ("Type IV Casette Tape", "Obsolete Electronics", 21.99, 1009), 
  ("Portable Stereo Cassette Player", "Obsolete Electronics", 14.99, 887), 
  ("Left Handed Can Opener", "Left Haned Appliances", 14.99, 1777), 
  ("Left Handed Computer Mouse", "Left Handed Appliances", 69.95, 3), 
  ("Hercules Hook", "Billy Mays Product", 3.68, 1907), 
  ("OxiClean", "Billy Mays Prouct", 12.89, 1039);