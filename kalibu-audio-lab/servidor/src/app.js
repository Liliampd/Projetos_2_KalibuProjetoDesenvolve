// servidor/src/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const rotas = require('./rotas');
const rotasUsuarios = require('./rotas_usuarios');
const rotasComentarios = require('./rotas_comentarios');
const rotasAdmin = require('./rotas_admin');            // <- rotas de admin

const requireJWT = require('./middlewares/jwt.middleware'); // <- seu middleware de login
const requireAdmin = require('./middlewares/requireAdmin'); // <- verifica is_admin

const { testarConexao } = require('./banco');

const app = express();
const PORTA = Number(process.env.PORTA || 4000);

// CORS + parsers
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Rotas públicas/normais
app.use('/', rotas);
app.use('/auth', rotasUsuarios);
app.use('/', rotasComentarios);

// Rotas SOMENTE para admin (cadeia de middlewares: precisa estar logada + ser admin)
app.use('/admin', requireJWT, requireAdmin, rotasAdmin);

// Rota utilitária para checar o banco
app.get('/teste-banco', async (req, res) => {
  try {
    const ok = await testarConexao();
    res.json({ ok, mensagem: ok ? 'Conexão com MySQL OK' : 'Falha ao conectar' });
  } catch (e) {
    res.status(500).json({ ok: false, erro: e.message });
  }
});

// Sobe o servidor se não estiver em modo de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORTA, () => {
    console.log(`✅ Servidor ouvindo em http://localhost:${PORTA}`);
  });
}

module.exports = app;
