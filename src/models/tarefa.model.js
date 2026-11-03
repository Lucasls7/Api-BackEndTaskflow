const prisma = require('../database/db');

async function listarTarefas(usuarioId) {
  return await prisma.tarefa.findMany({
    where: { usuarioId },
    include: {
      projeto: {
        select: { id: true, nome: true }
      }
    },
    orderBy: { criadoEm: 'desc' }
  });
}

async function buscarTarefaPorId(id, usuarioId) {
  return await prisma.tarefa.findFirst({
    where: { id: Number(id), usuarioId },
    include: {
      projeto: {
        select: { id: true, nome: true }
      }
    }
  });
}

async function criarTarefa(dados) {
  return await prisma.tarefa.create({
    data: {
      titulo: dados.titulo,
      descricao: dados.descricao,
      concluida: dados.concluida ?? false,
      usuarioId: Number(dados.usuarioId),
      projetoId: dados.projetoId ? Number(dados.projetoId) : null
    }
  });
}

async function atualizarTarefa(id, usuarioId, dados) {
  return await prisma.tarefa.updateMany({
    where: { id: Number(id), usuarioId },
    data: dados
  });
}

async function removerTarefa(id, usuarioId) {
  return await prisma.tarefa.deleteMany({
    where: { id: Number(id), usuarioId }
  });
}

module.exports = {
  listarTarefas,
  buscarTarefaPorId,
  criarTarefa,
  atualizarTarefa,
  removerTarefa
};