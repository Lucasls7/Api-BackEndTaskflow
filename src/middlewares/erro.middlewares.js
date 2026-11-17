const { Prisma } = require('@prisma/client');
const traduzirErroPrisma = require('../utils/traduzirErroPrisma');

function tratarErros(erro, req, res, next) {
  const erroTratado =
    erro instanceof Prisma.PrismaClientKnownRequestError
      ? traduzirErroPrisma(erro, req.method)
      : erro;

  const status = erroTratado.status || 500;

  console.error('[ERRO]', req.method, req.url, erroTratado.message);

  const mensagem =
    status === 500 ? 'Erro interno no servidor' : erroTratado.message;

  res.status(status).json({
    erro: {
      mensagem,
      detalhes: erroTratado.detalhes,
    },
  });
}

module.exports = tratarErros;