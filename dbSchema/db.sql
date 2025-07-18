CREATE DATABASE IF NOT EXISTS blocktracker;
USE blocktracker;

CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    surname VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    role INT NOT NULL DEFAULT 1,
    CONSTRAINT name_surname_CK UNIQUE (name,surname)
);

CREATE TABLE IF NOT EXISTS accounts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accountId INT NOT NULL,
    fromAcc VARCHAR(256) NOT NULL,
    toAcc VARCHAR(256) NOT NULL,
    value INT NOT NULL,
    block VARCHAR(256),
    hash VARCHAR(256),
    isErc20 TINYINT,
    contractAddress varchar(256),
    methodName varchar(256),
    name varchar(256),
    symbol varchar(256),
    decimals varchar(256),
    date INT,
    FOREIGN KEY (accountId) REFERENCES accounts (id) ON DELETE CASCADE
);