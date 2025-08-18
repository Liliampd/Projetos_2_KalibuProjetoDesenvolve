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

// Permitir acesso do front (ajustaremos a origem depois, por enquanto liberado)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Rotas básicas
app.use('/', rotas);
app.use('/auth', rotasUsuarios);
app.use('/', rotasComentarios);


// Teste rápido da conexão com o MySQL
app.get('/teste-banco', async (req, res) => {
  try {
    const ok = await testarConexao();
    res.json({ ok, mensagem: ok ? 'Conexão com MySQL OK' : 'Falha ao conectar' });
  } catch (e) {
    res.status(500).json({ ok: false, erro: e.message });
  }
});

app.listen(PORTA, () => {
  console.log(`✅ Servidor ouvindo em http://localhost:${PORTA}`);
});
