const prisma = require('../database/db');

async function listarProjetos(usuarioId) {
  return await prisma.projeto.findMany({
    where: { usuarioId },
    include: {
      _count: {
        select: { tarefas: true }
      }
    },
    orderBy: { criadoEm: 'desc' }
  });
}

async function buscarProjetoPorId(id, usuarioId) {
  return await prisma.projeto.findFirst({
    where: { id: Number(id), usuarioId },
    include: { tarefas: true }
  });
}

async function criarProjeto(dados) {
  return await prisma.projeto.create({
    data: {
      nome: dados.nome,
      descricao: dados.descricao,
      usuarioId: Number(dados.usuarioId)
    }
  });
}

async function atualizarProjeto(id, usuarioId, dados) {
  return await prisma.projeto.updateMany({
    where: { id: Number(id), usuarioId },
    data: dados
  });
}

async function removerProjeto(id, usuarioId) {
  return await prisma.projeto.deleteMany({
    where: { id: Number(id), usuarioId }
  });
}

module.exports = {
  listarProjetos,
  buscarProjetoPorId,
  criarProjeto,
  atualizarProjeto,
  removerProjeto
};