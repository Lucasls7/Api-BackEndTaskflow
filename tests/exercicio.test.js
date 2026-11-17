const criarErro = require('../src/utils/criarErro');
const traduzirErroPrisma = require('../src/utils/traduzirErroPrisma');

describe('Exercício Dia 3', () => {
  test('criarErro(500) devolve status 500 e detalhes undefined', () => {
    const erro = criarErro(500, 'Erro interno no servidor');

    expect(erro.status).toBe(500);
    expect(erro.detalhes).toBeUndefined();
  });

  test('P2003 ao atualizar (PUT) vira 400 com mensagem adequada', () => {
    const erroPrisma = { code: 'P2003' };
    const erro = traduzirErroPrisma(erroPrisma, 'PUT');

    expect(erro.status).toBe(400);
    expect(erro.message).toBe('Um dos ids informados não existe');
  });

  test('P2025 tem a mensagem Registro não encontrado', () => {
    const erroPrisma = { code: 'P2025' };
    const erro = traduzirErroPrisma(erroPrisma, 'GET');

    expect(erro.message).toBe('Registro não encontrado');
  });

  test('P2003 ao excluir (DELETE) tem mensagem de registros ligados', () => {
    const erroPrisma = { code: 'P2003' };
    const erro = traduzirErroPrisma(erroPrisma, 'DELETE');

    expect(erro.message).toBe('Não é possível excluir: existem registros ligados a este');
  });
});