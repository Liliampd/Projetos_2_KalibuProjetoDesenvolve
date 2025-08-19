// src/rotas_usuarios.js
const express = require('express');
const router = express.Router();

const ctrl = require('./controladores/usuario.controller');
const { exigirAuth } = require('./auth');

// (debug opcional) descomente pra ver o que está vindo
// console.log('usuario.controller exporta:', Object.keys(ctrl));
// console.log('exigirAuth type:', typeof exigirAuth);

router.post('/registrar', ctrl.registrar);           // POST /auth/registrar
router.post('/entrar',    ctrl.entrar);              // POST /auth/entrar
router.get('/perfil',     exigirAuth, ctrl.perfil);  // GET  /auth/perfil
router.post('/sair',      ctrl.sair);                // POST /auth/sair

module.exports = router;
