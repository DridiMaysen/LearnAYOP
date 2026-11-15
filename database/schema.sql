CREATE DATABASE IF NOT EXISTS learnayop
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE learnayop;

-- Les comptes
CREATE TABLE utilisateurs (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom           VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe  VARCHAR(255) NOT NULL,
    role          ENUM('etudiant','admin') NOT NULL DEFAULT 'etudiant',
    cree_le       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Les connexions ratées (pour bloquer la force brute)
CREATE TABLE tentatives_connexion (
    id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email     VARCHAR(150) NOT NULL,
    ip        VARCHAR(45)  NOT NULL,
    tente_le  DATETIME     NOT NULL,
    INDEX idx_email_date (email, tente_le),
    INDEX idx_ip_date    (ip, tente_le)
) ENGINE=InnoDB;