// src/auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const NOME_COOKIE = process.env.COOKIE_NOME || 'token';

// Gera um token JWT
function gerarToken(payload) {
  return jwt.sign(payload, process.env.JWT_SEGREDO, {
    expiresIn: process.env.JWT_EXPIRA || '2d'
  });
}

// Middleware para verificar se o usuário está autenticado
function autenticar(req, res, next) {
  try {
    const token = req.cookies?.[NOME_COOKIE] || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ ok: false, mensagem: 'Não autenticado' });

    const dados = jwt.verify(token, process.env.JWT_SEGREDO);
    req.usuario = dados; // exemplo: { id, nome_completo, email }
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, mensagem: 'Token inválido ou expirado' });
  }
}

// Grava o token em um cookie
function gravarCookieToken(res, token) {
  const ehProd = process.env.NODE_ENV === 'production';
  res.cookie(NOME_COOKIE, token, {
    httpOnly: true,
    sameSite: ehProd ? 'none' : 'lax',
    secure: ehProd,
    maxAge: 1000 * 60 * 60 * 24 * 2 // 2 dias
  });
}

// Limpa o cookie de sessão
function limparCookieToken(res) {
  const ehProd = process.env.NODE_ENV === 'production';
  res.clearCookie(NOME_COOKIE, {
    httpOnly: true,
    sameSite: ehProd ? 'none' : 'lax',
    secure: ehProd
  });
}

module.exports = { gerarToken, autenticar, gravarCookieToken, limparCookieToken };
