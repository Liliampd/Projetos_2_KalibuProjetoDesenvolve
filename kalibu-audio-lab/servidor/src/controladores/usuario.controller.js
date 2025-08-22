// src/controladores/usuario.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../modelos/usuario.model');

const JWT_SEGREDO = process.env.JWT_SEGREDO || 'segredo_dev';
const JWT_EXPIRA  = process.env.JWT_EXPIRA  || '2d';

function criarToken(payload) {
  return jwt.sign(payload, JWT_SEGREDO, { expiresIn: JWT_EXPIRA });
}

function gravarCookieToken(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(process.env.COOKIE_NOME || 'kalibu_token', token, {
    httpOnly: true,
    sameSite: isProd ? 'None' : 'Lax',
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

module.exports = {
  registrar: async (req, res) => {
    try {
      const { nome_completo, email, senha } = req.body;
      if (!nome_completo || !email || !senha) {
        return res.status(400).json({ ok: false, mensagem: 'Dados obrigatórios ausentes.' });
      }
      if (await UsuarioModel.emailExiste(email)) {
        return res.status(409).json({ ok: false, mensagem: 'E-mail já cadastrado.' });
      }
      const senha_hash = await bcrypt.hash(senha, 10);
      const usuario = await UsuarioModel.criar({ nome_completo, email, senha_hash });

      const token = criarToken({ id: usuario.id, nome_completo, email });
      gravarCookieToken(res, token);

      res.status(201).json({ ok: true, usuario, token });
    } catch (e) {
      res.status(500).json({ ok: false, mensagem: e.message });
    }
  },

  entrar: async (req, res) => {
    try {
      const { email, senha } = req.body;
      const u = await UsuarioModel.buscarPorEmail(email);
      if (!u) return res.status(401).json({ ok: false, mensagem: 'Credenciais inválidas.' });

      const confere = await bcrypt.compare(senha, u.senha_hash);
      if (!confere) return res.status(401).json({ ok: false, mensagem: 'Credenciais inválidas.' });

      const token = criarToken({ id: u.id, nome_completo: u.nome_completo, email: u.email });
      gravarCookieToken(res, token);

      res.json({ ok: true, usuario: { id: u.id, nome_completo: u.nome_completo, email: u.email }, token });
    } catch (e) {
      res.status(500).json({ ok: false, mensagem: e.message });
    }
  },

  perfil: async (req, res) => {
    try {
      const u = await UsuarioModel.buscarPorId(req.usuario.id);
      res.json({ ok: true, usuario: u });
    } catch (e) {
      res.status(500).json({ ok: false, mensagem: e.message });
    }
  },

  sair: async (_req, res) => {
    res.clearCookie(process.env.COOKIE_NOME || 'kalibu_token');
    res.json({ ok: true });
  }
};
