// src/banco.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_PORT = 3306,
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'kalibu_lab',
} = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
});

let poolClosed = false;

// >>> Mantém compatível com mysql2: retorna [rows, fields]
async function query(sql, params) {
  if (poolClosed) throw new Error('Pool is closed');
  return pool.query(sql, params);      // [rows, fields]
}

async function execute(sql, params) {
  if (poolClosed) throw new Error('Pool is closed');
  return pool.execute(sql, params);    // [rows, fields]
}

function getPool() {
  return pool;
}

async function endPool() {
  if (!poolClosed) {
    await pool.end();
    poolClosed = true;
  }
}

// Auto-teste de conexão: roda só fora de testes
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      const [rows] = await pool.query('SELECT DATABASE() AS db');
      console.log('Conectado ao DB:', rows?.[0]?.db || '(desconhecido)');
    } catch (err) {
      console.error('Erro ao conectar no DB:', err.message);
    }
  })();
}

module.exports = { query, execute, getPool, endPool };
