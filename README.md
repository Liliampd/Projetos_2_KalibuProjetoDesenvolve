# Projetos_2_KalibuProjetoDesenvolve

Projeto desenvolvido para a disciplina de Projetos 2.

# Alunos:

Liliam Ferreira dos Santos.


# Como rodar o back-end
cd kalibu-audio-lab/servidor
npm i
npm run dev

# Como rodar 
cd kalibu-audio-lab/servidor
npm test


# Projetos_2_KalibuProjetoDesenvolve


# Rodar o código completo com os testes.
cd kalibu-audio-lab/servidor
npm i
npm run dev
npm test


---

# Projetos\_2\_KalibuProjetoDesenvolve

Aplicação didática “**Kalibu Áudio Lab**” com **front-end estático (HTML/CSS/JS)** e **back-end Node.js/Express + MySQL** para cadastro/login e comentários (criar, listar, editar e excluir com autorização).

##  O que tem aqui

* Páginas: `index.html`, `sobre.html`, `conteudo.html`, `cadastro.html`, `login.html`
* API (Node/Express) com:

  * Autenticação com **JWT** (`/auth/cadastro`, `/auth/login`, `/auth/perfil`, `/auth/sair`)
  * Comentários com vínculo ao usuário (`/comentarios` GET/POST e `/comentarios/:id` PUT/DELETE)
* **MySQL** com duas tabelas: `usuarios` e `comentarios`
* Controle de permissão: **só o dono edita/exclui** o próprio comentário
* `.env.example` para facilitar a configuração local

---

## 🧰 Tecnologias

* Front: HTML5, CSS3, JavaScript
* Back: Node.js (Express)
* DB: MySQL
* Auth: JWT (Bearer e cookie)
* Outras: CORS, bcrypt, dotenv

---

##  Estrutura (resumida)

```
kalibu-audio-lab/
├─ assets/ ... (CSS/IMG)
├─ index.html | sobre.html | conteudo.html | cadastro.html | login.html
└─ servidor/
   ├─ src/
   │  ├─ app.js               # Express app
   │  ├─ modelos/             # Models (DB)
   │  ├─ controladores/       # Controllers (regras)
   │  ├─ rotas*.js            # Rotas da API
   │  └─ middlewares/         # (auth etc.)
   ├─ schema.sql              # Criação das tabelas
   ├─ .env.example            # Exemplo de variáveis
   ├─ package.json
   └─ server.js (ou script npm) para subir a API
```


---

## ⚙️ Configuração (passo a passo)

### 1) Requisitos

* Node.js LTS 18+
* MySQL 8+
* Extensão “Live Server” (VS Code) **ou** qualquer forma de servir arquivos estáticos (opcional; pode abrir o HTML direto também)

### 2) Banco de dados

1. Crie o database (no MySQL Workbench, por exemplo):

   ```sql
   CREATE DATABASE kalibu_lab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE kalibu_lab;
   ```
2. Rode o script `kalibu-audio-lab/servidor/schema.sql` para criar as tabelas `usuarios` e `comentarios`.

### 3) Variáveis de ambiente

Na pasta `kalibu-audio-lab/servidor`:

1. Copie o arquivo de exemplo:

   ```
   cp .env.example .env
   ```
2. Abra o `.env` e ajuste conforme seu MySQL. Exemplo:

   ```
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=kalibu_lab
   DB_PORT=3306

   PORT=4000
   JWT_SECRET=dev-jwt-123
   COOKIE_SECRET=dev-cookie-123
   CORS_ORIGINS=http://127.0.0.1:5500,http://localhost:5500
   ```

### 4) Instalar e rodar o back-end

Na pasta `kalibu-audio-lab/servidor`:

```bash
npm install
npm run dev           # ou: npm start
```

A API deve subir em **[http://localhost:4000](http://localhost:4000)**.

### 5) Rodar o front-end

* Abra o projeto no VS Code e clique com o botão direito em `index.html` → **Open with Live Server**
  (ou abra os arquivos HTML direto no navegador se preferir)
* Navegue até **conteudo.html** para testar os comentários.

---

##  Fluxo de uso (manual)

1. **Cadastro:** abra `cadastro.html`, crie um usuário (nome, email, senha).
2. **Login:** faça login em `login.html`.

   * O front salva o token JWT no `localStorage` com a chave `kalibu_token`.
3. **Conteúdo/Comentários:** abra `conteudo.html`.

   * Se logado, verá **Bem-vindo(a), *seu nome*** e o botão **Sair**.
   * Pode **publicar**, **editar** e **excluir** comentários.
   * A lista mostra *autor • data/hora* e o texto.

---

## 📡 Endpoints principais

Base URL: `http://localhost:4000`

### Auth

* `POST /auth/cadastro`
  Body: `{ nome, email, senha }`
* `POST /auth/login`
  Body: `{ email, senha }` → retorna JWT; também podemos definir cookie
* `GET /auth/perfil`
  Headers: `Authorization: Bearer <token>`
* `POST /auth/sair`
  Encerra a sessão (apaga cookie), o front também remove o token do `localStorage`

### Comentários

* `GET /comentarios?pagina=conteudo` → lista comentários da página
* `POST /comentarios` (auth)
  Body: `{ pagina, texto }`
* `PUT /comentarios/:id` (auth / dono)
* `DELETE /comentarios/:id` (auth / dono)

---

## Testes (controllers/models) — visão simples

* **Models**: funções que falam com o MySQL (ex.: inserir usuário, buscar por email, listar comentários).
* **Controllers**: regras de cada rota (ex.: validar login, checar dono do comentário).
* **Como testamos** (ideia geral): criar usuário de teste, fazer login, criar comentário, editar/excluir, e checar os retornos da API.

  ```

 

---

## Limpar dados de teste 

No MySQL (ajuste o padrão do email se precisar):

```sql
SET SQL_SAFE_UPDATES = 0;

DELETE FROM comentarios
WHERE autor_id IN (
  SELECT id FROM usuarios
  WHERE email LIKE 'jest\_%@teste.com' ESCAPE '\\'
);

DELETE FROM usuarios
WHERE email LIKE 'jest\_%@teste.com' ESCAPE '\\';

SET SQL_SAFE_UPDATES = 1;
```


## Problemas comuns

* **CORS**: confira `CORS_ORIGINS` no `.env` (inclua `http://127.0.0.1:5500` e `http://localhost:5500`).
* **DB connection**: teste usuário/senha/porta/DB no `.env`.
* **Porta ocupada**: mude `PORT` no `.env` ou feche processos na 4000.
* **“Anônimo” nos comentários**: verifique o retorno de `/auth/perfil` e o token no `localStorage`.

---

## Para o professor fazer os testess.

1. Clonar o repo.
2. Criar o DB `kalibu_lab` e rodar `servidor/schema.sql`.
3. Na pasta `kalibu-audio-lab/servidor`: `cp .env.example .env` e preenche as credenciais do MySQL.
4. `npm i` e `npm run dev` para subir a API.
5. Abrir o front (`index.html` → Live Server) e navegar nas páginas: **cadastro → login → conteúdo**.


##  Observação sobre segurança

* O arquivo **`.env` real não vai para o Git.**
  No repositório há apenas o **`.env.example`** (modelo sem segredos).
  No `servidor/.gitignore` já ignoramos `.env`, `node_modules`, etc.

