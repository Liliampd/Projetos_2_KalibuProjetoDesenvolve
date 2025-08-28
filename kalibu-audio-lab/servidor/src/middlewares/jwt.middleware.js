// src/middlewares/jwt.middleware.js
const jwt = require('jsonwebtoken');

const JWT_SEGREDO = process.env.JWT_SEGREDO || 'dev_secret';

module.exports = function requireJWT(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ ok: false, mensagem: 'Token ausente' });
  }

  try {
    // payload: { id, email, is_admin, iat, exp }
    const payload = jwt.verify(token, JWT_SEGREDO);
    req.user = payload; // <- padronize aqui
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, mensagem: 'Token inválido' });
  }
};
