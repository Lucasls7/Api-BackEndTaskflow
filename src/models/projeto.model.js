const prisma = require("../database/db");

async function listarProjetos() {
  return await prisma.projeto.findMany({
    orderBy: { id: "desc" },
  });
}

async function buscarProjetoPorId(id) {
  return await prisma.projeto.findUnique({
    where: { id: Number(id) },
  });
}

async function criarProjeto(dados) {
  return await prisma.projeto.create({
    data: {
      descricao: dados.descricao || dados.nome,
      ativo: dados.ativo !== undefined ? dados.ativo : true,
    },
  });
}

async function atualizarProjeto(id, usuarioId, dados) {
  return await prisma.projeto.update({
    where: { id: Number(id) },
    data: {
      ...(dados.descricao !== undefined && { descricao: dados.descricao }),
      ...(dados.ativo !== undefined && { ativo: dados.ativo }),
    },
  });
}

async function removerProjeto(id) {
  return await prisma.projeto.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  listarProjetos,
  buscarProjetoPorId,
  criarProjeto,
  atualizarProjeto,
  removerProjeto,
};