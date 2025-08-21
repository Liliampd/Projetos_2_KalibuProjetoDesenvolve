const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// carrega variáveis do .env
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kalibu_lab',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// log simpático da conexão (sem travar a app se falhar)
(async () => {
  try {
    const [rows] = await pool.query('SELECT DATABASE() AS db');
    console.log('Conectado ao DB:', rows?.[0]?.db || '(desconhecido)');
  } catch (err) {
    console.error('Erro ao conectar no DB:', err.message);
  }
})();

// método para o Jest encerrar a pool
pool.fechar = async () => {
  try {
    await pool.end();
  } catch (_) {}
};

module.exports = pool;
