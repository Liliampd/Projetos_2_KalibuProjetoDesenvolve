const express = require('express');
const { listar, criar, atualizar, excluir } = require('./controladores/comentario.controller');
const auth = require('./auth');

const router = express.Router();
router.get('/comentarios', listar);
router.post('/comentarios', auth, criar);
router.put('/comentarios/:id', auth, atualizar);
router.delete('/comentarios/:id', auth, excluir);

module.exports = router;
