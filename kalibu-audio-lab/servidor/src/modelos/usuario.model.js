// src/modelos/usuario.model.js
const { pool } = require('../banco');

class UsuarioModel {
  static async criar({ nome_completo, email, senha_hash }) {
    const [r] = await pool.execute(
      `INSERT INTO usuarios (nome_completo, email, senha_hash) VALUES (?,?,?)`,
      [nome_completo, email, senha_hash]
    );
    return { id: r.insertId, nome_completo, email };
  }

  static async buscarPorEmail(email) {
    const [rows] = await pool.execute(
      `SELECT id, nome_completo, email, senha_hash FROM usuarios WHERE email = ? LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.execute(
      `SELECT id, nome_completo, email FROM usuarios WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }

  static async emailExiste(email) {
    const [rows] = await pool.execute(
      `SELECT 1 FROM usuarios WHERE email = ? LIMIT 1`,
      [email]
    );
    return !!rows[0];
  }
}

module.exports = UsuarioModel;
