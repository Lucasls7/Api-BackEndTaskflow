const { Prisma } = require('@prisma/client');
const validar = require('../src/middlewares/validar');
const schemas = require('../src/middlewares/schemas');
const tratarErros = require('../src/middlewares/erro.middlewares');
const criarErro = require('../src/utils/criarErro');

function pegarErro(funcao) {
  try {
    funcao();
  } catch (erro) {
    return erro;
  }
}

function criarRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Exercício Dia 4', () => {
  test('validar(schemas.usuario) com e-mail inválido retorna 400 e não chama next', () => {
    const middleware = validar(schemas.usuario);
    const req = {
      body: { nome: 'Ana Silva', email: 'ana@', senha: 'segredo123' },
    };
    const next = jest.fn();

    const erro = pegarErro(() => middleware(req, {}, next));

    expect(erro.status).toBe(400);
    expect(erro.detalhes).toHaveLength(1);
    expect(erro.detalhes[0]).toMatch(/email/i);
    expect(next).not.toHaveBeenCalled();
  });

  test('validar(schemas.usuario) com nome "Al" e senha "123" retorna dois detalhes na ordem', () => {
    const middleware = validar(schemas.usuario);
    const req = {
      body: { nome: 'Al', email: 'ana@email.com', senha: '123' },
    };
    const next = jest.fn();

    const erro = pegarErro(() => middleware(req, {}, next));

    expect(erro.status).toBe(400);
    expect(erro.detalhes).toHaveLength(2);
    expect(erro.detalhes[0]).toMatch(/nome/i);
    expect(erro.detalhes[1]).toMatch(/senha/i);
    expect(next).not.toHaveBeenCalled();
  });

  test('validar(schemas.projeto) com descricao de 201 caracteres retorna detalhe de tamanho máximo', () => {
    const middleware = validar(schemas.projeto);
    const req = {
      body: { nome: 'TaskFlow', descricao: 'a'.repeat(201) },
    };
    const next = jest.fn();

    const erro = pegarErro(() => middleware(req, {}, next));

    expect(erro.status).toBe(400);
    expect(erro.detalhes).toHaveLength(1);
    expect(erro.detalhes[0]).toMatch(/descricao/i);
    expect(next).not.toHaveBeenCalled();
  });

  test('tratarErros com criarErro(400) chama res.status 1 vez com 400 e envia detalhes no json', () => {
    const detalhes = ["O campo 'texto' é obrigatório"];
    const erro = criarErro(400, 'Dados inválidos', detalhes);
    const res = criarRes();

    tratarErros(erro, { method: 'POST', url: '/tarefas' }, res, jest.fn());

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: { mensagem: 'Dados inválidos', detalhes },
    });
  });

  test('tratarErros com erro do Prisma P2025 (PUT) responde 404 com mensagem adequada', () => {
    const erro = new Prisma.PrismaClientKnownRequestError(
      'Record to update not found',
      {
        code: 'P2025',
        clientVersion: '6.0.0',
      }
    );
    const res = criarRes();

    tratarErros(erro, { method: 'PUT', url: '/tarefas/999' }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      erro: { mensagem: 'Registro não encontrado', detalhes: undefined },
    });
  });
});