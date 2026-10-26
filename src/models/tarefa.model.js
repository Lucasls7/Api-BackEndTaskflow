// let tarefas = [
//   {
//     id: 1,
//     texto: "Estudar",
//     prioridade: "alta",
//     coluna: "andamento",
//     cidade: "",
//     usuarioId: 1,
//     concluidaEm: null,
//   },
//   {
//     id: 2,
//     texto: "Criar",
//     prioridade: "alta",
//     coluna: "andamento",
//     cidade: "",
//     usuarioId: 1,
//     concluidaEm: null,
//   },
//   {
//     id: 3,
//     texto: "Testar",
//     prioridade: "media",
//     coluna: "concluido",
//     cidade: "",
//     usuarioId: 1,
//     concluidaEm: "2026-03-01T10:00:00.000Z",
//   },
// ];

// let proximoId = 4;

// module.exports = {
//   listar: ({ coluna, prioridade, usuarioId } = {}) => {
//     if (usuarioId !== undefined) {
//       const usuarioExiste = usuarioModel.buscar(parseInt(usuarioId));

//       if (!usuarioExiste) {
//         return [];
//       }
//     }

//     let resultado = tarefas;

//     if (usuarioId !== undefined) {
//       resultado = resultado.filter((t) => t.usuarioId === parseInt(usuarioId));
//     }

//     if (coluna) {
//       resultado = resultado.filter((t) => (t.coluna || "afazer") === coluna);
//     }

//     if (prioridade) {
//       resultado = resultado.filter((t) => t.prioridade === prioridade);
//     }

//     return resultado;
//   },

//   listarPorColuna: (coluna) =>
//     tarefas.filter((t) => (t.coluna || "afazer") === coluna),

//   listarPorPrioridade: (prioridade) =>
//     tarefas.filter((t) => t.prioridade === prioridade),

//   buscar: (id) => tarefas.find((t) => t.id === id),

//   contarPorUsuario: (usuarioId) =>
//     tarefas.filter((t) => t.usuarioId === usuarioId).length,

//   contarPorUsuarioEColuna: (usuarioId, coluna) =>
//     tarefas.filter(
//       (t) => t.usuarioId === usuarioId && (t.coluna || "afazer") === coluna,
//     ).length,

//   adicionar: ({ texto, prioridade, coluna, cidade, usuarioId }) => {
//     const novaColuna = coluna || "afazer";

//     const nova = {
//       id: proximoId++,
//       texto,
//       prioridade: prioridade || "media",
//       coluna: novaColuna,
//       cidade: cidade || "",
//       usuarioId,
//       concluidaEm:
//         novaColuna === "concluido" ? new Date().toISOString() : null,

//     };

//     tarefas.push(nova);
//     return nova;
//   },

//   atualizar: (id, dados) => {
//     const idx = tarefas.findIndex((t) => t.id === id);
//     if (idx === -1) return null;

//     let concluidaEm = tarefas[idx].concluidaEm || null;

//     if (dados.coluna !== undefined) {
//       if (dados.coluna === "concluido") {
//         concluidaEm = new Date().toISOString();
//       } else {
//         concluidaEm = null;
//       }
//     }

//     tarefas[idx] = {
//       ...tarefas[idx],
//       ...dados,
//       id,
//       concluidaEm,
//     };

//     return tarefas[idx];
//   },

//   remover: (id) => {
//     const idx = tarefas.findIndex((t) => t.id === id);
//     if (idx === -1) return null;

//     return tarefas.splice(idx, 1)[0];
//   },

//   obterEstatisticas: (coluna) => {
//     const base = coluna
//       ? tarefas.filter((t) => (t.coluna || "afazer") === coluna)
//       : tarefas;

//     const total = base.length;

//     const porColuna = {
//       afazer: base.filter((t) => (t.coluna || "afazer") === "afazer").length,
//       andamento: base.filter((t) => t.coluna === "andamento").length,
//       concluido: base.filter((t) => t.coluna === "concluido").length,
//     };

//     const porPrioridade = {
//       alta: base.filter((t) => t.prioridade === "alta").length,
//       media: base.filter((t) => t.prioridade === "media").length,
//       baixa: base.filter((t) => t.prioridade === "baixa").length,
//     };

//     const colunaMaisTarefas = Object.entries(porColuna).sort(
//       (a, b) => b[1] - a[1],
//     )[0][0];

//     return {
//       total,
//       porColuna,
//       porPrioridade,
//       colunaMaisTarefas,
//     };
//   },
// };













// tarefa.model.js (com banco)

const pool = require('../database/db');

module.exports = {
  listar: async () => {
    const result = await pool.query(
      'SELECT * FROM tarefas ORDER BY id'
    );
    return result.rows;
  },

  buscar: async (id) => {
    const result = await pool.query(
      'SELECT * FROM tarefas WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  adicionar: async ({ texto, prioridade, coluna, usuarioId, projetoId }) => {
    const result = await pool.query(
      'INSERT INTO tarefas (texto, prioridade, coluna, usuario_id, projeto_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [texto, prioridade || 'media', coluna || 'afazer', usuarioId, projetoId]
    );
    return result.rows[0];
  },

  atualizar: async (id, dados) => {
    const { texto, prioridade, coluna, usuarioId } = dados;
    const result = await pool.query(
      'UPDATE tarefas SET texto = $1, prioridade = $2, coluna = $3, usuario_id = $4 WHERE id = $5 RETURNING *',
      [texto, prioridade, coluna, usuarioId, id]
    );
    return result.rows[0] || null;
  },

  remover: async (id) => {
    const result = await pool.query(
      'DELETE FROM tarefas WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  },
};