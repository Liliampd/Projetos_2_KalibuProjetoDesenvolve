const express = require('express');
const router = express.Router();
const pool = require('./banco'); // usa o pool do mysql2/promise

router.get('/health', (req, res) => {
  const u = req.user || req.usuario || null;
  return res.json({
    ok: true,
    usuario: u ? { id: u.id, email: u.email, is_admin: !!u.is_admin } : null,
  });
});


router.get('/comentarios', async (req, res) => {
  try {
    const { pagina = '' } = req.query;

    const where = [];
    const params = [];

    if (pagina) {
      where.push('c.pagina = ?');
      params.push(pagina);
    }

    const sql = `
      SELECT
        c.id, c.pagina, c.texto, c.criado_em, c.autor_id,
        u.nome  AS autor_nome,
        u.email AS autor_email
      FROM comentarios c
      LEFT JOIN usuarios u ON u.id = c.autor_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY c.criado_em DESC
      LIMIT 200
    `;
    const [linhas] = await pool.execute(sql, params);
    return res.json({ ok: true, comentarios: linhas });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
});

router.delete('/comentarios/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ ok: false, mensagem: 'id inválido' });

    const [r] = await pool.execute('DELETE FROM comentarios WHERE id = ? LIMIT 1', [id]);
    if (r.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensagem: 'Comentário não encontrado' });
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
});


router.get('/usuarios', async (_req, res) => {
  try {
    const sql = `
      SELECT id, nome, email, is_admin, criado_em
      FROM usuarios
      ORDER BY criado_em DESC
      LIMIT 500
    `;
    const [linhas] = await pool.execute(sql);
    return res.json({ ok: true, usuarios: linhas });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
});

router.patch('/usuarios/:id/admin', async (req, res) => {
  try {
    const id = Number(req.params.id);
    let { is_admin } = req.body || {};

    is_admin = (is_admin === true || is_admin === 1 || is_admin === '1') ? 1 : 0;

    if (!id) return res.status(400).json({ ok: false, mensagem: 'id inválido' });

    const [r] = await pool.execute('UPDATE usuarios SET is_admin = ? WHERE id = ? LIMIT 1', [is_admin, id]);
    if (r.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensagem: 'Usuário não encontrado' });
    }
    return res.json({ ok: true, id, is_admin: !!is_admin });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
});

router.delete('/usuarios/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ ok: false, mensagem: 'id inválido' });

    const me = req.user || req.usuario || null;
    if (me && Number(me.id) === id) {
      return res.status(400).json({ ok: false, mensagem: 'Você não pode excluir a si mesma.' });
    }

    const [r] = await pool.execute('DELETE FROM usuarios WHERE id = ? LIMIT 1', [id]);
    if (r.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensagem: 'Usuário não encontrado' });
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
});

module.exports = router;
