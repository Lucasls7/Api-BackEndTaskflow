const prisma = require('../database/db');

function extrairIdValido(usuarioId) {
  const idBruto = typeof usuarioId === 'object' ? (usuarioId?.id || usuarioId?.usuarioId) : usuarioId;
  const idNum = Number(idBruto);
  return isNaN(idNum) ? null : idNum;
}

async function listarTarefas(usuarioId) {
  const idFormatado = extrairIdValido(usuarioId);

  if (!idFormatado) {
    throw { status: 400, mensagem: "ID de usuário inválido." };
  }

  return await prisma.tarefa.findMany({
    where: { 
      usuarioId: idFormatado 
    },
    orderBy: { id: 'desc' }
  });
}

async function buscarTarefaPorId(id, usuarioId) {
  const idUsuarioFormatado = extrairIdValido(usuarioId);

  return await prisma.tarefa.findFirst({
    where: { 
      id: Number(id), 
      usuarioId: idUsuarioFormatado 
    }
  });
}

async function criarTarefa(dados) {
  const idUsuarioFormatado = extrairIdValido(dados.usuarioId);

  return await prisma.tarefa.create({
    data: {
      texto: dados.texto || dados.titulo,
      prioridade: dados.prioridade,
      coluna: dados.coluna,
      usuarioId: idUsuarioFormatado
    }
  });
}

async function atualizarTarefa(id, usuarioId, dados) {
  const idUsuarioFormatado = extrairIdValido(usuarioId);

  return await prisma.tarefa.updateMany({
    where: { 
      id: Number(id), 
      usuarioId: idUsuarioFormatado 
    },
    data: dados
  });
}

async function removerTarefa(id, usuarioId) {
  const idUsuarioFormatado = extrairIdValido(usuarioId);

  return await prisma.tarefa.deleteMany({
    where: { 
      id: Number(id), 
      usuarioId: idUsuarioFormatado 
    }
  });
}

module.exports = {
  listar: listarTarefas,
  listarTarefas,
  buscarPorId: buscarTarefaPorId,
  buscarTarefaPorId,
  criar: criarTarefa,
  criarTarefa,
  atualizar: atualizarTarefa,
  atualizarTarefa,
  remover: removerTarefa,
  removerTarefa
};