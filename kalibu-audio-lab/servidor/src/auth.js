const jwt = require('jsonwebtoken');

module.exports = function autenticar(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, mensagem: 'Token ausente' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.usuarioId = payload.id;
    next();
  } catch {
    return res.status(401).json({ ok: false, mensagem: 'Token inválido' });
  }
};
