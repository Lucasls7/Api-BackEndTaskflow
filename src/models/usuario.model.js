const prisma = require('../database/db');

async function buscarPorEmail(email) {
  return await prisma.usuario.findUnique({
    where: { email }
  });
}

async function buscarPorId(id) {
  return await prisma.usuario.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      nome: true,
      email: true,
      criadoEm: true
    }
  });
}

async function criarUsuario(dados) {
  return await prisma.usuario.create({
    data: {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha
    }
  });
}

module.exports = {
  buscarPorEmail,
  buscarPorId,
  criarUsuario
};