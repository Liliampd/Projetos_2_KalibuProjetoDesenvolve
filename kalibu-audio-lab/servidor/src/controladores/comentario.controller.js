// src/controladores/comentario.controller.js
const ComentarioModel = require('../modelos/comentario.model');

module.exports = {
  listar: async (req, res) => {
    try {
      const { pagina } = req.query;
      const comentarios = await ComentarioModel.listarPorPagina(pagina);
      res.json({ ok: true, comentarios });
    } catch (e) {
      res.status(500).json({ ok: false, mensagem: e.message });
    }
  },

  criar: async (req, res) => {
    try {
      const { pagina, texto } = req.body;
      const autor_id = req.usuario.id;
      if (!texto?.trim()) return res.status(400).json({ ok:false, mensagem: 'Texto vazio.' });

      const c = await ComentarioModel.criar({ pagina, texto: texto.trim(), autor_id });
      res.status(201).json({ ok: true, comentario: c });
    } catch (e) {
      res.status(500).json({ ok: false, mensagem: e.message });
    }
  },

  atualizar: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { texto } = req.body;
      const autor_id = req.usuario.id;

      const n = await ComentarioModel.atualizar({ id, texto, autor_id });
      if (!n) return res.status(403).json({ ok:false, mensagem: 'Sem permissão para editar.' });

      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ ok: false, mensagem: e.message });
    }
  },

  excluir: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const autor_id = req.usuario.id;

      const n = await ComentarioModel.excluir({ id, autor_id });
      if (!n) return res.status(403).json({ ok:false, mensagem: 'Sem permissão para excluir.' });

      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ ok: false, mensagem: e.message });
    }
  }
};
