const express = require('express');
const router = express.Router();

const { registrar, entrar, perfil } = require('./controladores/auth.controller');
const requireJWT = require('./middlewares/jwt.middleware');

router.post('/registrar', registrar);
router.post('/entrar', entrar);

// precisa estar autenticado para ver o perfil
router.get('/perfil', requireJWT, perfil);

module.exports = router;
