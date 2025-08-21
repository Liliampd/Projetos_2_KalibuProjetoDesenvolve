const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuario.model');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

async function registrar(req, res) {
  try {
    const { nome = '', email, senha } = req.body || {};
    if (!email || !senha) {
      return res.status(400).json({ ok: false, mensagem: 'email e senha são obrigatórios' });
    }

    const existente = await Usuario.buscarPorEmail(email);
    if (existente) {
      return res.status(409).json({ ok: false, mensagem: 'Email já registrado' });
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.criar({ nome, email, senha_hash });
    const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({ ok: true, usuario, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
}

async function entrar(req, res) {
  try {
    const { email, senha } = req.body || {};
    const u = await Usuario.buscarPorEmail(email);
    if (!u) return res.status(401).json({ ok: false, mensagem: 'Credenciais inválidas' });

    const ok = await bcrypt.compare(senha, u.senha_hash);
    if (!ok) return res.status(401).json({ ok: false, mensagem: 'Credenciais inválidas' });

    const token = jwt.sign({ id: u.id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ ok: true, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
}

async function perfil(req, res) {
  try {
    const u = await Usuario.buscarPorId(req.usuarioId);
    if (!u) return res.status(404).json({ ok: false, mensagem: 'Usuário não encontrado' });
    return res.json({ ok: true, usuario: u });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
}

module.exports = { registrar, entrar, perfil };
