// src/rotas.js
const express = require('express');
const router = express.Router();

// rota de saúde (teste rápido do servidor)
router.get('/saude', (req, res) => {
  res.json({ ok: true, mensagem: 'Servidor funcionando' });
});

module.exports = router;
