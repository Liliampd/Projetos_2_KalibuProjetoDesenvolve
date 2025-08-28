const express = require('express');
const router = express.Router();

router.get('/saude', (req, res) => {
  res.json({ ok: true, mensagem: 'Servidor funcionando' });
});

module.exports = router;
