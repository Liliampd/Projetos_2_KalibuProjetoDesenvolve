const express = require('express');
const { registrar, entrar, perfil } = require('./controladores/auth.controller');
const auth = require('./auth');

const router = express.Router();
router.post('/registrar', registrar);
router.post('/entrar', entrar);
router.get('/perfil', auth, perfil);

module.exports = router;
