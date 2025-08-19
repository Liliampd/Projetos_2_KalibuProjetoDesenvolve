// src/rotas_comentarios.js
const express = require('express');
const router = express.Router();

const ctrl = require('./controladores/comentario.controller');
const { exigirAuth } = require('./auth');

// console.log('comentario.controller exporta:', Object.keys(ctrl));

router.get('/comentarios', ctrl.listar);
router.post('/comentarios', exigirAuth, ctrl.criar);
router.put('/comentarios/:id', exigirAuth, ctrl.atualizar);
router.delete('/comentarios/:id', exigirAuth, ctrl.excluir);

module.exports = router;
