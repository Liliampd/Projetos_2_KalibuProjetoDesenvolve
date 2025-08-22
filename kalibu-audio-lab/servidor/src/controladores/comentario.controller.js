const Comentario = require('../modelos/comentario.model');

async function listar(req, res) {
  try {
    const { pagina } = req.query;
    const comentarios = await Comentario.listar({ pagina });
    return res.json({ ok: true, comentarios });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
}

async function criar(req, res) {
  try {
    const { pagina, texto } = req.body || {};
    const comentario = await Comentario.criar({ pagina, texto, autor_id: req.usuarioId });
    return res.status(201).json({ ok: true, comentario });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
}

async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { texto } = req.body || {};
    const ok = await Comentario.atualizar({ id, texto, autor_id: req.usuarioId });
    return res.json({ ok });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
}

async function excluir(req, res) {
  try {
    const { id } = req.params;
    const ok = await Comentario.excluir({ id, autor_id: req.usuarioId });
    return res.json({ ok });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
}

module.exports = { listar, criar, atualizar, excluir };
