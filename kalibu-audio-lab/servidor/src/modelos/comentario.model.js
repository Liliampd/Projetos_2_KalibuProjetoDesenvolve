// src/modelos/comentario.model.js
const pool = require('../banco');

class Comentario {
  static async listar() {
    const [rows] = await pool.execute(
      'SELECT id, pagina, texto, autor_id, criado_em FROM comentarios ORDER BY id DESC'
    );
    return rows;
  }

  static async criar({ pagina, texto, autor_id }) {
    const [result] = await pool.execute(
      'INSERT INTO comentarios (pagina, texto, autor_id) VALUES (?,?,?)',
      [pagina, texto, autor_id]
    );
    const [rows] = await pool.execute(
      'SELECT id, pagina, texto, autor_id, criado_em FROM comentarios WHERE id = ?',
      [result.insertId]
    );
    return rows[0];
  }

  static async atualizar({ id, texto, autor_id }) {
    const [result] = await pool.execute(
      'UPDATE comentarios SET texto = ? WHERE id = ? AND autor_id = ?',
      [texto, id, autor_id]
    );
    return result.affectedRows > 0;
  }

  static async excluir({ id, autor_id }) {
    const [result] = await pool.execute(
      'DELETE FROM comentarios WHERE id = ? AND autor_id = ?',
      [id, autor_id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Comentario;
