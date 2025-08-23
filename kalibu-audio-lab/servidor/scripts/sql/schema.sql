-- Cria o banco e o usuário para o projeto
CREATE DATABASE IF NOT EXISTS kalibu_lab
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'kalibu_app'@'%' IDENTIFIED BY 'kalibu123';
GRANT ALL PRIVILEGES ON kalibu_lab.* TO 'kalibu_app'@'%';
FLUSH PRIVILEGES;

USE kalibu_lab;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de comentários
CREATE TABLE IF NOT EXISTS comentarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pagina VARCHAR(100) NOT NULL,
  texto TEXT NOT NULL,
  autor_id INT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
