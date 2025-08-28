// src/modelos/usuario.model.js
const pool = require('../banco'); // usa o pool do mysql2/promise (CommonJS)

class Usuario {
  static async criar({ nome, email, senha_hash }) {
    const sql = `
      INSERT INTO usuarios (nome, email, senha_hash)
      VALUES (?,?,?)
    `;
    const params = [nome || null, email, senha_hash];
    const [resultado] = await pool.execute(sql, params);

    // por padrão, novo usuário vem com is_admin = 0 no banco
    return {
      id: resultado.insertId,
      nome: nome || null,
      email,
      is_admin: 0,
    };
  }

  static async buscarPorEmail(email) {
    const sql = `
      SELECT id, nome, email, senha_hash, is_admin
      FROM usuarios
      WHERE email = ?
      LIMIT 1
    `;
    const [linhas] = await pool.execute(sql, [email]);
    return linhas[0] || null;
  }

  static async buscarPorId(id) {
    const sql = `
      SELECT id, nome, email, senha_hash, is_admin
      FROM usuarios
      WHERE id = ?
      LIMIT 1
    `;
    const [linhas] = await pool.execute(sql, [id]);
    return linhas[0] || null;
  }
}

module.exports = Usuario;
