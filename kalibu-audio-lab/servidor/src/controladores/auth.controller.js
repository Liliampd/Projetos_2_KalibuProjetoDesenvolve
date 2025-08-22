// src/controladores/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuario.model');

const JWT_SEGREDO = process.env.JWT_SEGREDO || 'dev_secret';
const JWT_EXPIRA = process.env.JWT_EXPIRA || '2d';

function gerarToken(payload) {
  return jwt.sign(payload, JWT_SEGREDO, { expiresIn: JWT_EXPIRA });
}

// POST /auth/registrar
async function registrar(req, res) {
  try {
    const { email = '', senha = '', nome: nomeRaw } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({ ok: false, mensagem: 'email e senha são obrigatórios' });
    }

    // nome padrão quando não for enviado
    const nome =
      (typeof nomeRaw === 'string' && nomeRaw.trim()) ||
      (email.includes('@') ? email.split('@')[0] : 'Usuário');

    const senha_hash = await bcrypt.hash(String(senha), 10);

    // cria usuário
    const usuario = await Usuario.criar({ nome, email, senha_hash });

    const token = gerarToken({ id: usuario.id, email: usuario.email });

    // devolve apenas campos seguros
    return res.status(201).json({
      ok: true,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
      token,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
}

// POST /auth/entrar
async function entrar(req, res) {
  try {
    const { email = '', senha = '' } = req.body || {};
    if (!email || !senha) {
      return res.status(400).json({ ok: false, mensagem: 'email e senha são obrigatórios' });
    }

    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ ok: false, mensagem: 'Credenciais inválidas' });
    }

    const confere = await bcrypt.compare(String(senha), usuario.senha_hash);
    if (!confere) {
      return res.status(401).json({ ok: false, mensagem: 'Credenciais inválidas' });
    }

    const token = gerarToken({ id: usuario.id, email: usuario.email });
    return res.json({ ok: true, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
}

// GET /auth/perfil  (requer middleware que popula req.usuario)
async function perfil(req, res) {
  try {
    if (!req.usuario) {
      return res.status(401).json({ ok: false, mensagem: 'Não autorizado' });
    }
    return res.json({ ok: true, usuario: req.usuario });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
}

module.exports = { registrar, entrar, perfil };
