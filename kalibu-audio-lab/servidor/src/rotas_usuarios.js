// src/rotas_usuarios.js
const express = require('express');
const router = express.Router();

const { registrar, entrar, perfil } = require('./controladores/auth.controller');
const autenticarJWT = require('./middlewares/jwt.middleware');

// Auth
router.post('/registrar', registrar);
router.post('/entrar', entrar);
router.get('/perfil', autenticarJWT, perfil);

module.exports = router;
