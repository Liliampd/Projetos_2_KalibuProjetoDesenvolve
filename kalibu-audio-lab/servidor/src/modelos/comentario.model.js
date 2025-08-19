// src/modelos/comentario.model.js
const { pool } = require('../banco');

class ComentarioModel {
  static async criar({ pagina, texto, autor_id }) {
    const [r] = await pool.execute(
      `INSERT INTO comentarios (pagina, texto, autor_id) VALUES (?,?,?)`,
      [pagina, texto, autor_id]
    );
    return { id: r.insertId, pagina, texto, autor_id };
  }

  static async listarPorPagina(pagina) {
    const [rows] = await pool.execute(
      `SELECT c.id, c.pagina, c.texto, c.autor_id, c.criado_em,
              u.nome_completo AS autor
         FROM comentarios c
         JOIN usuarios u ON u.id = c.autor_id
        WHERE c.pagina = ?
        ORDER BY c.criado_em DESC`,
      [pagina]
    );
    return rows;
  }

  static async atualizar({ id, texto, autor_id }) {
    const [r] = await pool.execute(
      `UPDATE comentarios SET texto = ? WHERE id = ? AND autor_id = ?`,
      [texto, id, autor_id]
    );
    return r.affectedRows; // 1 se alterou, 0 se não é dono ou não existe
  }

  static async excluir({ id, autor_id }) {
    const [r] = await pool.execute(
      `DELETE FROM comentarios WHERE id = ? AND autor_id = ?`,
      [id, autor_id]
    );
    return r.affectedRows;
  }
}

module.exports = ComentarioModel;
