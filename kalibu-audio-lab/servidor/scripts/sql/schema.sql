-- Kalibu Áudio Lab - schema.sql (completo)

-- 1) Banco de dados (charset completo para emojis etc.)
CREATE DATABASE IF NOT EXISTS kalibu_lab
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2) Usuário de acesso ao banco (ajuste a senha se quiser)
CREATE USER IF NOT EXISTS 'kalibu_app'@'%' IDENTIFIED BY 'kalibu123';
GRANT ALL PRIVILEGES ON kalibu_lab.* TO 'kalibu_app'@'%';
FLUSH PRIVILEGES;

-- 3) Use o schema do projeto
USE kalibu_lab;

-- Tabela: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(100),
  email      VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  is_admin   TINYINT(1) NOT NULL DEFAULT 0,
  criado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Índice adicional (acelera buscas por email, já é UNIQUE, mas mantemos por clareza)
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Tabela: comentarios
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

-- Índices úteis para filtros e joins
CREATE INDEX IF NOT EXISTS idx_comentarios_autor  ON comentarios(autor_id);
CREATE INDEX IF NOT EXISTS idx_comentarios_pagina ON comentarios(pagina);
