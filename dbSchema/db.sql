CREATE DATABASE IF NOT EXISTS blocktracker;
USE blocktracker;
CREATE TABLE IF NOT EXISTS accounts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accountId INT,
    fromAcc VARCHAR(256) NOT NULL,
    toAcc VARCHAR(256) NOT NULL,
    value INT NOT NULL,
    block VARCHAR(256),
    hash VARCHAR(256),
    isErc20 TINYINT,
    contract_address varchar(256),
    date INT,
    FOREIGN KEY (accountId) REFERENCES accounts (id)
);