// src/auth.js
const jwt = require('jsonwebtoken');
const JWT_SEGREDO = process.env.JWT_SEGREDO || 'segredo_dev';

function exigirAuth(req, res, next) {
  try {
    // 1) tenta pelo header Authorization: Bearer <token>
    const auth = req.headers.authorization || '';
    const tokenHeader = auth.startsWith('Bearer ') ? auth.slice(7) : null;

    // 2) tenta pelo cookie (kalibu_token por padrão)
    const tokenCookie =
      req.cookies?.token ||
      req.cookies?.[process.env.COOKIE_NOME || 'kalibu_token'];

    const token = tokenHeader || tokenCookie;
    if (!token) return res.status(401).json({ ok: false, mensagem: 'Não autorizado.' });

    const payload = jwt.verify(token, JWT_SEGREDO);
    req.usuario = {
      id: payload.id,
      nome_completo: payload.nome_completo,
      email: payload.email
    };
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, mensagem: 'Token inválido.' });
  }
}

module.exports = { exigirAuth };
