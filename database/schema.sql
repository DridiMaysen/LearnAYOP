CREATE DATABASE IF NOT EXISTS learnayop
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE learnayop;

-- Les comptes
CREATE TABLE IF NOT EXISTS utilisateurs (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom           VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe  VARCHAR(255) NOT NULL,
    role          ENUM('etudiant','admin') NOT NULL DEFAULT 'etudiant',
    cree_le       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Les connexions ratées (protection force brute)
CREATE TABLE IF NOT EXISTS tentatives_connexion (
    id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email     VARCHAR(150) NOT NULL,
    ip        VARCHAR(45)  NOT NULL,
    tente_le  DATETIME     NOT NULL,
    INDEX idx_email_date (email, tente_le),
    INDEX idx_ip_date    (ip, tente_le)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Le catalogue et contenu des cours
CREATE TABLE IF NOT EXISTS cours (
    id            VARCHAR(10)  NOT NULL PRIMARY KEY,
    cle           VARCHAR(120) NOT NULL UNIQUE,
    sigle         VARCHAR(150) NOT NULL,
    titre_carte   VARCHAR(150) NOT NULL,
    tag           VARCHAR(80)  NOT NULL,
    niveau        VARCHAR(30)  NOT NULL,
    matiere       VARCHAR(30)  NOT NULL,
    matiere_label VARCHAR(30)  NOT NULL,
    difficulte    VARCHAR(30)  NOT NULL,
    cover         VARCHAR(50)  NOT NULL,
    icone         VARCHAR(80)  NOT NULL,
    description   TEXT         NOT NULL,
    contenu       LONGTEXT     NOT NULL,
    visible       TINYINT(1)   NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;