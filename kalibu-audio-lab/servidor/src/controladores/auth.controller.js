const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuario.model');

const JWT_SEGREDO = process.env.JWT_SEGREDO || 'dev_secret';
const JWT_EXPIRA = process.env.JWT_EXPIRA || '2d';

function gerarToken(payload) {
  const tokenPayload = {
    id: payload.id,
    email: payload.email,
    is_admin:
      payload.is_admin === true ||
      payload.is_admin === 1 ||
      payload.is_admin === '1'
  };

  return jwt.sign(tokenPayload, JWT_SEGREDO, { expiresIn: JWT_EXPIRA });
}


async function registrar(req, res) {
  try {
    const { email = '', senha = '', nome: nomeRaw } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({ ok: false, mensagem: 'email e senha são obrigatórios' });
    }

    const nome =
      (typeof nomeRaw === 'string' && nomeRaw.trim()) ||
      (email.includes('@') ? email.split('@')[0] : 'Usuário');

    const senha_hash = await bcrypt.hash(String(senha), 10);

    const usuario = await Usuario.criar({ nome, email, senha_hash });

const token = gerarToken({
  id: usuario.id,
  email: usuario.email,
  is_admin: usuario.is_admin   
});

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
const token = gerarToken({
  id: usuario.id,
  email: usuario.email,
  is_admin: usuario.is_admin   
});

    return res.json({ ok: true, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
}

async function perfil(req, res) {
  try {
    const u = req.user || req.usuario;
    if (!u || !u.id) {
      return res.status(401).json({ ok: false, mensagem: 'Não autenticado' });
    }
    return res.json({ ok: true, usuario: u });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensagem: e.message });
  }
}


module.exports = { registrar, entrar, perfil };
