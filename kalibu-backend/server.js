const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Conexão com o MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "810502", 
  database: "kalibu_lab",
});

// Testar conexão
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
  } else {
    console.log("Conectado ao MySQL!");
  }
});

// Rota POST para salvar comentário
app.post("/comentarios", (req, res) => {
  const { nome, mensagem } = req.body;
  const sql = "INSERT INTO comentarios (nome, mensagem) VALUES (?, ?)";
  db.query(sql, [nome, mensagem], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao salvar comentário." });
    }
    res.json({ status: "sucesso" });
  });
});

// Rota GET para listar comentários
app.get("/comentarios", (req, res) => {
  const sql = "SELECT nome, mensagem, DATE_FORMAT(data_envio, '%d/%m/%Y %H:%i') AS data FROM comentarios ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao buscar comentários." });
    }
    res.json(results);
  });
  
  // Rota DELETE para deletar um comentário pelo id
app.delete("/comentarios/:id", (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM comentarios WHERE id = ?";
    db.query(sql, [id], (err, resultado) => {
        if (err) {
            console.error("Erro ao deletar comentário:", err);
            res.status(500).json({ status: "erro" });
        } else {
            res.json({ status: "sucesso" });
        }
    });
});

});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
