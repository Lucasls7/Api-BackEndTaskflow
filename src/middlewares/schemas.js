const schemas = {
  tarefa: {
    texto: { obrigatorio: true, tipo: "string" },
    coluna: {
      obrigatorio: true,
      tipo: "string",
      enum: ["afazer", "andamento", "concluido"],
    },
    usuario_id: { obrigatorio: true, formato: "inteiro-positivo" },
    projeto_id: { obrigatorio: true, formato: "inteiro-positivo" },
    idprioridade: { obrigatorio: true, formato: "inteiro-positivo" },
  },

  usuario: {
    nome: { obrigatorio: true, tipo: "string", minLength: 3 },
    email: { obrigatorio: true, tipo: "string", formato: "email" },
    senha: { obrigatorio: true, tipo: "string", minLength: 6 },
  },

  projeto: {
    nome: { obrigatorio: true, tipo: "string" },
    descricao: { obrigatorio: false, tipo: "string", maxLength: 200 },
  },

  id: {
    id: { obrigatorio: true, formato: "inteiro-positivo" },
  },
};

module.exports = schemas;