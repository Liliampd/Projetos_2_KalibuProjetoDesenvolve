// Fecha conexões abertas do MySQL após TODOS os testes
const db = require('../banco');

afterAll(async () => {
  try {
    if (db && typeof db.fechar === 'function') {
      await db.fechar();
    } else if (db && typeof db.end === 'function') {
      await db.end();
    }
  } catch (err) {
    // evita que um erro de shutdown quebre o Jest
  }
});
