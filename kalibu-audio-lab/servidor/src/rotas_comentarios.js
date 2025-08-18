// src/rotas_comentarios.js
const express = require('express');
const router = express.Router();
const { pool } = require('./banco');
const { autenticar } = require('./auth');

// CRIAR comentário (precisa estar logado)
router.post('/comentarios', autenticar, async (req, res) => {
  try {
    const { pagina, texto } = req.body;
    if (!pagina || !texto) {
      return res.status(400).json({ ok: false, mensagem: 'Informe pagina e texto' });
    }

    const usuario_id = req.usuario.id;
    const [r] = await pool.query(
      'INSERT INTO comentarios (usuario_id, pagina, texto) VALUES (?, ?, ?)',
      [usuario_id, pagina, texto]
    );

    const [linhas] = await pool.query(
      `SELECT c.id, c.pagina, c.texto, c.criado_em, c.atualizado_em,
              u.id AS autor_id, u.nome_completo AS autor
         FROM comentarios c
         JOIN usuarios u ON u.id = c.usuario_id
        WHERE c.id = ?`, [r.insertId]
    );

    return res.status(201).json({ ok: true, comentario: linhas[0] });
  } catch (e) {
    return res.status(500).json({ ok: false, mensagem: 'Erro ao criar comentário', erro: e.message });
  }
});

// LISTAR comentários (público)
router.get('/comentarios', async (req, res) => {
  try {
    const { pagina } = req.query;
    let sql = `SELECT c.id, c.pagina, c.texto, c.criado_em, c.atualizado_em,
                      u.id AS autor_id, u.nome_completo AS autor
                 FROM comentarios c
                 JOIN usuarios u ON u.id = c.usuario_id`;
    const params = [];
    if (pagina) { sql += ' WHERE c.pagina = ?'; params.push(pagina); }
    sql += ' ORDER BY c.criado_em DESC';

    const [rows] = await pool.query(sql, params);
    return res.json({ ok: true, comentarios: rows });
  } catch (e) {
    return res.status(500).json({ ok: false, mensagem: 'Erro ao listar', erro: e.message });
  }
});

// EDITAR comentário (só o dono, logado)
router.put('/comentarios/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;
    if (!texto) return res.status(400).json({ ok: false, mensagem: 'Informe o novo texto' });

    const [rows] = await pool.query('SELECT usuario_id FROM comentarios WHERE id = ?', [id]);
    const c = rows[0];
    if (!c) return res.status(404).json({ ok: false, mensagem: 'Comentário não encontrado' });
    if (c.usuario_id !== req.usuario.id) return res.status(403).json({ ok: false, mensagem: 'Sem permissão' });

    await pool.query('UPDATE comentarios SET texto = ? WHERE id = ?', [texto, id]);
    return res.json({ ok: true, mensagem: 'Comentário atualizado' });
  } catch (e) {
    return res.status(500).json({ ok: false, mensagem: 'Erro ao editar', erro: e.message });
  }
});

// EXCLUIR comentário (só o dono, logado)
router.delete('/comentarios/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT usuario_id FROM comentarios WHERE id = ?', [id]);
    const c = rows[0];
    if (!c) return res.status(404).json({ ok: false, mensagem: 'Comentário não encontrado' });
    if (c.usuario_id !== req.usuario.id) return res.status(403).json({ ok: false, mensagem: 'Sem permissão' });

    await pool.query('DELETE FROM comentarios WHERE id = ?', [id]);
    return res.json({ ok: true, mensagem: 'Comentário excluído' });
  } catch (e) {
    return res.status(500).json({ ok: false, mensagem: 'Erro ao excluir', erro: e.message });
  }
});

module.exports = router;
