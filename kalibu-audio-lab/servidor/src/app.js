// src/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const rotas = require('./rotas');
const rotasUsuarios = require('./rotas_usuarios');
const rotasComentarios = require('./rotas_comentarios');

const { testarConexao } = require('./banco');

const app = express();
const PORTA = Number(process.env.PORTA || 4000);

// CORS (ajuste a origin depois, se quiser restringir)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Rotas
app.use('/', rotas);
app.use('/auth', rotasUsuarios);
app.use('/', rotasComentarios);

// Rota para testar conexão com o banco
app.get('/teste-banco', async (req, res) => {
  try {
    const ok = await testarConexao();
    res.json({ ok, mensagem: ok ? 'Conexão com MySQL OK' : 'Falha ao conectar' });
  } catch (e) {
    res.status(500).json({ ok: false, erro: e.message });
  }
});

// Só sobe o servidor quando NÃO estiver em testes
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORTA, () => {
    console.log(`✅ Servidor ouvindo em http://localhost:${PORTA}`);
  });
}

// Exporta o app para os testes (supertest) importarem
module.exports = app;
