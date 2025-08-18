// src/rotas_usuarios.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('./banco');
const { gerarToken, gravarCookieToken, limparCookieToken, autenticar } = require('./auth');

const router = express.Router();

// POST /auth/registrar
router.post('/registrar', async (req, res) => {
  try {
    const { nome_completo, email, senha } = req.body;

    if (!nome_completo || !email || !senha) {
      return res.status(400).json({ ok: false, mensagem: 'Informe nome, email e senha' });
    }

    const [dup] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (dup.length > 0) {
      return res.status(409).json({ ok: false, mensagem: 'E-mail já cadastrado' });
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    const [r] = await pool.query(
      'INSERT INTO usuarios (nome_completo, email, senha_hash) VALUES (?, ?, ?)',
      [nome_completo, email, senha_hash]
    );

    const usuario = { id: r.insertId, nome_completo, email };
    const token = gerarToken(usuario);
    gravarCookieToken(res, token);

    // 🔴 AQUI: devolvemos também o token no JSON
    return res.status(201).json({ ok: true, usuario, token });
  } catch (e) {
    return res.status(500).json({ ok: false, mensagem: 'Erro ao registrar', erro: e.message });
  }
});

// POST /auth/entrar
router.post('/entrar', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ ok: false, mensagem: 'Informe email e senha' });

    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ ok: false, mensagem: 'Credenciais inválidas' });

    const confere = await bcrypt.compare(senha, user.senha_hash);
    if (!confere) return res.status(401).json({ ok: false, mensagem: 'Credenciais inválidas' });

    const usuario = { id: user.id, nome_completo: user.nome_completo, email: user.email };
    const token = gerarToken(usuario);
    gravarCookieToken(res, token);

    // 🔴 AQUI: devolvemos também o token no JSON
    return res.json({ ok: true, usuario, token });
  } catch (e) {
    return res.status(500).json({ ok: false, mensagem: 'Erro ao entrar', erro: e.message });
  }
});

// GET /auth/perfil (protegida)
router.get('/perfil', autenticar, (req, res) => {
  return res.json({ ok: true, usuario: req.usuario });
});

// POST /auth/sair
router.post('/sair', (req, res) => {
  limparCookieToken(res);
  return res.json({ ok: true, mensagem: 'Sessão encerrada' });
});

module.exports = router;
