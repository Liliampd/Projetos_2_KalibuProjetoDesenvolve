// src/middlewares/jwt.middleware.js
const jwt = require('jsonwebtoken');

const SEGREDO = process.env.JWT_SEGREDO || process.env.JWT_SECRET || 'dev_secret';

function autenticarJWT(req, res, next) {
  try {
    const auth = req.headers['authorization'] || '';
    const partes = auth.split(' ');
    const temBearer = partes.length === 2 && /^Bearer$/i.test(partes[0]);
    const token = temBearer ? partes[1] : null;

    if (!token) {
      return res.status(401).json({ ok: false, mensagem: 'Token ausente' });
    }

    const payload = jwt.verify(token, SEGREDO);
    // Preenche o usuário para o controller `perfil` devolver
    req.usuario = { id: payload.id, email: payload.email };
    return next();
  } catch (e) {
    return res.status(401).json({ ok: false, mensagem: 'Token inválido' });
  }
}

module.exports = autenticarJWT;
