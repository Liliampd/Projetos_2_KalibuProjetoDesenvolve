// servidor/src/banco.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || process.env.MYSQL_DATABASE || 'kalibu_lab',
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

// debug útil durante os testes
if (process.env.NODE_ENV === 'test') {
  pool.query('SELECT DATABASE() AS db')
      .then(([r]) => console.log('Conectado ao DB:', r[0].db))
      .catch(console.error);
}

module.exports = pool;
