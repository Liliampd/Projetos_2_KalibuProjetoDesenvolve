// src/tests/auth.test.js
const request = require('supertest');
const app = require('../app');

describe('Auth: registrar, entrar, perfil', () => {
  const email = `jest_${Date.now()}@teste.com`;
  const senha = '123456';
  const nome  = 'Usuário Jest';
  let token;

  test('POST /auth/registrar deve criar usuário e devolver token', async () => {
    const res = await request(app)
      .post('/auth/registrar')
      .send({ nome_completo: nome, email, senha });

    // aceita 200 ou 201, dependendo do seu controller
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('usuario');
    expect(res.body).toHaveProperty('token');

    token = res.body.token;
    expect(typeof token).toBe('string');
  });

  test('GET /auth/perfil deve retornar dados quando enviado Bearer token', async () => {
    const res = await request(app)
      .get('/auth/perfil')
      .set('Authorization', 'Bearer ' + token);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('usuario');
    expect(res.body.usuario).toHaveProperty('email', email);
  });

  test('POST /auth/entrar deve logar e devolver token', async () => {
    const res = await request(app)
      .post('/auth/entrar')
      .send({ email, senha });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(typeof res.body.token).toBe('string');
  });
});
