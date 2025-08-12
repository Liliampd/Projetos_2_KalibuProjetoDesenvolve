const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexão com MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // seu usuário MySQL
    password: "", // sua senha MySQL
    database: "kalibu_lab"
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar no banco:", err);
        return;
    }
    console.log("✅ Conectado ao MySQL!");
});

/* ===================== ROTAS DE COMENTÁRIOS ===================== */

// Listar comentários
app.get("/comentarios", (req, res) => {
    const sql = "SELECT * FROM comentarios ORDER BY data DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar comentários:", err);
            return res.status(500).json({ status: "erro", mensagem: "Erro no servidor." });
        }
        res.json(results);
    });
});

// Adicionar comentário
app.post("/comentarios", (req, res) => {
    const { nome, mensagem } = req.body;
    if (!nome || !mensagem) {
        return res.status(400).json({ status: "erro", mensagem: "Preencha todos os campos." });
    }
    const sql = "INSERT INTO comentarios (nome, mensagem) VALUES (?, ?)";
    db.query(sql, [nome, mensagem], (err) => {
        if (err) {
            console.error("Erro ao adicionar comentário:", err);
            return res.status(500).json({ status: "erro", mensagem: "Erro no servidor." });
        }
        res.json({ status: "sucesso" });
    });
});

// Deletar comentário
app.delete("/comentarios/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM comentarios WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erro ao deletar comentário:", err);
            return res.status(500).json({ status: "erro", mensagem: "Erro no servidor." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "erro", mensagem: "Comentário não encontrado." });
        }
        res.json({ status: "sucesso" });
    });
});

/* ===================== ROTAS DE USUÁRIOS ===================== */

// Listar usuários
app.get("/usuarios", (req, res) => {
    const sql = "SELECT id, nome, email, data_cadastro FROM usuarios ORDER BY data_cadastro DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar usuários:", err);
            return res.status(500).json({ status: "erro", mensagem: "Erro no servidor." });
        }
        res.json(results);
    });
});

// Cadastrar usuário
app.post("/usuarios", (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ status: "erro", mensagem: "Preencha todos os campos." });
    }
    const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
    db.query(sql, [nome, email, senha], (err) => {
        if (err) {
            console.error("Erro ao cadastrar usuário:", err);
            return res.status(500).json({ status: "erro", mensagem: "Erro no servidor." });
        }
        res.json({ status: "sucesso" });
    });
});

/* ===================== INICIAR SERVIDOR ===================== */
app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
