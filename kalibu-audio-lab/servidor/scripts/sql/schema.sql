
CREATE DATABASE IF NOT EXISTS kalibu_lab
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'kalibu_app'@'%' IDENTIFIED BY 'kalibu123';
GRANT ALL PRIVILEGES ON kalibu_lab.* TO 'kalibu_app'@'%';
FLUSH PRIVILEGES;

USE kalibu_lab;

CREATE TABLE IF NOT EXISTS usuarios (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(100),
  email      VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  is_admin   TINYINT(1) NOT NULL DEFAULT 0,
  criado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

CREATE TABLE IF NOT EXISTS comentarios (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  pagina     VARCHAR(100) NOT NULL,
  texto      TEXT NOT NULL,
  autor_id   INT NOT NULL,
  criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comentarios_autor
    FOREIGN KEY (autor_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX IF NOT EXISTS idx_comentarios_autor  ON comentarios(autor_id);
CREATE INDEX IF NOT EXISTS idx_comentarios_pagina ON comentarios(pagina);
