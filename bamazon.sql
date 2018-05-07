CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR (50) NOT NULL,
department_name VARCHAR (50) NOT NULL,
price DECIMAL (10,4) NOT NULL,
stock_quantity INT NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("BamazonBasics Cat Food", "Pet", 17.50, 4);
ALTER TABLE products
MODIFY COLUMN price DECIMAL (10,2);
SELECT * FROM products;