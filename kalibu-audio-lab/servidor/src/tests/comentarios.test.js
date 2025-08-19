// src/tests/comentarios.test.js
const request = require('supertest');
const app = require('../app');

describe('Comentários: CRUD com auth', () => {
  // cria um usuário só para os testes de comentário
  const email = `jest_com_${Date.now()}@teste.com`;
  const senha = '123456';
  const nome  = 'Comentador Jest';

  const PAGINA = 'conteudo';
  let token;
  let comentarioId;
  const textoOriginal = `Texto de teste ${Date.now()}`;
  const textoEditado  = `Texto EDITADO ${Date.now()}`;

  beforeAll(async () => {
    const r = await request(app)
      .post('/auth/registrar')
      .send({ nome_completo: nome, email, senha });
    token = r.body.token;
  });

  test('POST /comentarios cria um comentário', async () => {
    const res = await request(app)
      .post('/comentarios')
      .set('Authorization', 'Bearer ' + token)
      .send({ pagina: PAGINA, texto: textoOriginal });

    expect(res.statusCode).toBe(201); // se seu controller devolve 200, troque para 200
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('comentario');

    comentarioId = res.body.comentario.id;
    expect(typeof comentarioId).toBe('number');
  });

  test('GET /comentarios lista e contém o comentário criado', async () => {
    const res = await request(app)
      .get('/comentarios')
      .query({ pagina: PAGINA });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(Array.isArray(res.body.comentarios)).toBe(true);

    const encontrado = res.body.comentarios.find(c => c.id === comentarioId);
    expect(encontrado).toBeTruthy();
    expect(encontrado.texto).toBe(textoOriginal);
  });

  test('PUT /comentarios/:id edita o comentário', async () => {
    const res = await request(app)
      .put(`/comentarios/${comentarioId}`)
      .set('Authorization', 'Bearer ' + token)
      .send({ texto: textoEditado });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });

  test('DELETE /comentarios/:id exclui o comentário', async () => {
    const res = await request(app)
      .delete(`/comentarios/${comentarioId}`)
      .set('Authorization', 'Bearer ' + token);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });
});
