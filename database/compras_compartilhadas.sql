-- Banco de dados: Sistema de Lista de Compras Compartilhada
-- Script ajustado para MySQL / MariaDB (XAMPP + phpMyAdmin)

CREATE DATABASE IF NOT EXISTS compras_compartilhadas
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE compras_compartilhadas;

-- Remove as tabelas antigas, se existirem
DROP TABLE IF EXISTS compras;
DROP TABLE IF EXISTS itens;
DROP TABLE IF EXISTS listas;
DROP TABLE IF EXISTS usuario_grupos;
DROP TABLE IF EXISTS grupos;
DROP TABLE IF EXISTS usuarios;

-- ======================
-- TABELA: usuarios
-- ======================
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- TABELA: grupos
-- ======================
CREATE TABLE grupos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  criado_por INT NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_grupos_usuarios
    FOREIGN KEY (criado_por)
    REFERENCES usuarios(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- TABELA: usuario_grupos
-- ======================
CREATE TABLE usuario_grupos (
  usuario_id INT NOT NULL,
  grupo_id INT NOT NULL,
  papel VARCHAR(50) NOT NULL DEFAULT 'MEMBRO',
  entrou_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (usuario_id, grupo_id),

  CONSTRAINT fk_usuario_grupos_usuarios
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_usuario_grupos_grupos
    FOREIGN KEY (grupo_id)
    REFERENCES grupos(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- TABELA: listas
-- ======================
CREATE TABLE listas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grupo_id INT NOT NULL,
  titulo VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ABERTA',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_listas_grupos
    FOREIGN KEY (grupo_id)
    REFERENCES grupos(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- TABELA: itens
-- ======================
CREATE TABLE itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lista_id INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  unidade VARCHAR(50),
  comprado BOOLEAN NOT NULL DEFAULT FALSE,
  adicionado_por INT NOT NULL,
  adicionado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_itens_listas
    FOREIGN KEY (lista_id)
    REFERENCES listas(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_itens_usuarios
    FOREIGN KEY (adicionado_por)
    REFERENCES usuarios(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- TABELA: compras
-- ======================
CREATE TABLE compras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL UNIQUE,
  usuario_id INT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  comprado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observacao TEXT,

  CONSTRAINT fk_compras_itens
    FOREIGN KEY (item_id)
    REFERENCES itens(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_compras_usuarios
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================
-- DADOS DE TESTE OPCIONAIS
-- Você pode apagar esta parte se quiser importar só a estrutura.
-- ======================

INSERT INTO usuarios (nome, email, senha_hash)
VALUES
('Pedro', 'pedro@email.com', 'hash_teste_1'),
('João', 'joao@email.com', 'hash_teste_2'),
('Maria', 'maria@email.com', 'hash_teste_3');

INSERT INTO grupos (titulo, criado_por)
VALUES
('República Alpha', 1);

INSERT INTO usuario_grupos (usuario_id, grupo_id, papel)
VALUES
(1, 1, 'ADMIN'),
(2, 1, 'MEMBRO'),
(3, 1, 'MEMBRO');

INSERT INTO listas (grupo_id, titulo, status)
VALUES
(1, 'Compras da Semana', 'ABERTA');

INSERT INTO itens (lista_id, nome, quantidade, unidade, comprado, adicionado_por)
VALUES
(1, 'Arroz', 1, 'pacote', TRUE, 1),
(1, 'Feijão', 2, 'pacote', FALSE, 2),
(1, 'Leite', 3, 'litro', FALSE, 3);

INSERT INTO compras (item_id, usuario_id, valor, observacao)
VALUES
(1, 1, 25.90, 'Compra realizada no mercado');
