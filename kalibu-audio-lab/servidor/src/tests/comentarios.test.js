// servidor/src/tests/comentarios.test.js
const request = require('supertest');
const app = require('../app');
const { encerrarPool } = require('../banco');

const PAGINA = 'conteudo'; // mesma página que você usa no front

// helper para logar a resposta quando algo der errado
function dump(label, res) {
  // mostra status, body (json) e texto cru, para qualquer caso
  console.log(
    `\n----- ${label} -----\nSTATUS:`,
    res.statusCode,
    '\nBODY:',
    res.body,
    '\nTEXT:',
    res.text,
    '\n---------------------\n'
  );
}

describe('Comentários: CRUD com auth', () => {
  let token;
  let comentarioId;

  const email = `jest_${Date.now()}@exemplo.com`;
  const senha = '123456';
  const nome = 'Usuário Jest';

  beforeAll(async () => {
    // registra e já pega o token
    const res = await request(app)
      .post('/auth/registrar')
      .send({ nome_completo: nome, email, senha });

    if (![200, 201].includes(res.statusCode) || !res.body?.token) {
      dump('FALHA NO REGISTRO', res);
      throw new Error('Não foi possível registrar usuário de teste.');
    }
    token = res.body.token;
  });

  afterAll(async () => {
    await encerrarPool?.();
  });

  test('POST /comentarios cria um comentário', async () => {
    const textoOriginal = 'comentário para teste - jest';
    const res = await request(app)
      .post('/comentarios')
      .set('Authorization', 'Bearer ' + token)
      .send({ pagina: PAGINA, texto: textoOriginal });

    if (![200, 201].includes(res.statusCode)) dump('POST /comentarios', res);

    expect([200, 201]).toContain(res.statusCode); // aceita 200 ou 201
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('comentario');

    comentarioId = res.body.comentario?.id;
    expect(typeof comentarioId).toBe('number');
  });

  test('GET /comentarios lista e contém o comentário criado', async () => {
    const res = await request(app)
      .get('/comentarios')
      .query({ pagina: PAGINA });

    if (res.statusCode !== 200) dump('GET /comentarios', res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(Array.isArray(res.body.comentarios)).toBe(true);

    const achou = res.body.comentarios.some(c => c.id === comentarioId);
    expect(achou).toBe(true);
  });

  test('PUT /comentarios/:id edita o comentário', async () => {
    const textoEditado = 'comentário editado - jest';
    const res = await request(app)
      .put(`/comentarios/${comentarioId}`)
      .set('Authorization', 'Bearer ' + token)
      .send({ texto: textoEditado });

    if (res.statusCode !== 200) dump('PUT /comentarios/:id', res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });

  test('DELETE /comentarios/:id exclui o comentário', async () => {
    const res = await request(app)
      .delete(`/comentarios/${comentarioId}`)
      .set('Authorization', 'Bearer ' + token);

    if (res.statusCode !== 200) dump('DELETE /comentarios/:id', res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });
});
