// const tarefaModel = require("../models/tarefa.model");
// const usuarioModel = require("../models/usuario.model");

// const PRIORIDADES_VALIDAS = ["alta", "media", "baixa"];
// const COLUNAS_VALIDAS = ["afazer", "andamento", "concluido"];

// const tarefasController = {
//   listar(req, res) {
//     const resultado = tarefaModel.listar(req.query);
//     res.json(resultado);
//   },

//   buscarPorId(req, res) {
//     const tarefa = tarefaModel.buscar(parseInt(req.params.id));

//     if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });

//     res.json(tarefa);
//   },

//   criar(req, res) {
//     const { texto, prioridade, coluna } = req.body;

//     const usuarioId = req.usuario.id;

//     // if (!texto) {
//     //   return res.status(400).json({ erro: "Texto obrigatório" });
//     // }

//     // if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
//     //   return res.status(400).json({
//     //     erro: "Prioridade inválida. Use: alta, media ou baixa",
//     //   });
//     // }

//     // if (coluna && !COLUNAS_VALIDAS.includes(coluna)) {
//     //   return res.status(400).json({
//     //     erro: "Coluna inválida. Use: afazer, andamento ou concluido",
//     //   });
//     // }

//     const usuarioExiste = usuarioModel.buscar(usuarioId);

//     if (!usuarioExiste) {
//       return res.status(400).json({
//         erro: "Usuário não encontrado",
//       });
//     }

//     if (coluna === "andamento") {
//       const totalAndamento = tarefaModel.contarPorUsuarioEColuna(
//         usuarioId,
//         "andamento",
//       );

//       if (totalAndamento >= 2) {
//         return res.status(400).json({
//           erro: "Limite de 2 tarefas em andamento por usuário atingido",
//         });
//       }
//     }

//     const tarefa = tarefaModel.adicionar({
//       ...req.body,
//       usuarioId,
//     });

//     res.status(201).json(tarefa);
//   },

//   atualizar(req, res) {
//     const id = parseInt(req.params.id);
//     const { prioridade, coluna, usuarioId } = req.body;

//     if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
//       return res.status(400).json({
//         erro: "Prioridade inválida. Use: alta, media ou baixa",
//       });
//     }

//     if (coluna && !COLUNAS_VALIDAS.includes(coluna)) {
//       return res.status(400).json({
//         erro: "Coluna inválida. Use: afazer, andamento ou concluido",
//       });
//     }

//     const tarefaAtual = tarefaModel.buscar(id);
//     if (!tarefaAtual) {
//       return res.status(404).json({ erro: "Tarefa não encontrada" });
//     }

//     const idUsuarioEfetivo = usuarioId
//       ? parseInt(usuarioId)
//       : tarefaAtual.usuarioId;

//     if (
//       idUsuarioEfetivo &&
//       coluna === "andamento" &&
//       tarefaAtual.coluna !== "andamento"
//     ) {
//       const totalAndamento = tarefaModel.contarPorUsuarioEColuna(
//         idUsuarioEfetivo,
//         "andamento",
//       );

//       if (totalAndamento >= 2) {
//         return res.status(400).json({
//           erro: "Limite de 2 tarefas em andamento por usuário atingido",
//         });
//       }
//     }

//     const atualizada = tarefaModel.atualizar(id, req.body);
//     res.json(atualizada);
//   },

//   remover(req, res) {
//     const removida = tarefaModel.remover(parseInt(req.params.id));

//     if (!removida)
//       return res.status(404).json({ erro: "Tarefa não encontrada" });

//     res.json({ mensagem: "Tarefa removida", tarefa: removida });
//   },

//   estatisticas(req, res) {
//     const dadosEstatistcos = tarefaModel.obterEstatisticas(req.query.coluna);
//     res.json(dadosEstatistcos);
//   },
// };

// module.exports = tarefasController;



const tarefaModel = require("../models/tarefa.model");
const usuarioModel = require("../models/usuario.model");

const PRIORIDADES_VALIDAS = ["alta", "media", "baixa"];
const COLUNAS_VALIDAS = ["afazer", "andamento", "concluido"];

const tarefasController = {
  async listar(req, res) {
    try {
      const resultado = await tarefaModel.listar(req.query);
      res.json(resultado);
    } catch (error) {
      console.log("erro no listar", error)
      res.status(500).json({ erro: "Erro ao listar tarefas" });
    }
  },

  async buscarPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const tarefa = await tarefaModel.buscar(id);

      if (!tarefa) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
      }

      res.json(tarefa);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao buscar tarefa" });
    }
  },

  async criar(req, res) {
    try {
      const { texto, prioridade, coluna, projetoId } = req.body;
      const usuarioId = req.usuario.id;

      // Validações básicas
      if (!texto) {
        return res.status(400).json({ erro: "Texto obrigatório" });
      }

      if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
        return res.status(400).json({
          erro: "Prioridade inválida. Use: alta, media ou baixa",
        });
      }

      if (coluna && !COLUNAS_VALIDAS.includes(coluna)) {
        return res.status(400).json({
          erro: "Coluna inválida. Use: afazer, andamento ou concluido",
        });
      }

      const usuarioExiste = await usuarioModel.buscar(usuarioId);
      if (!usuarioExiste) {
        return res.status(400).json({ erro: "Usuário não encontrado" });
      }

      // Validação de limite em "andamento"
      if (coluna === "andamento") {
        const totalAndamento = await tarefaModel.contarPorUsuarioEColuna(
          usuarioId,
          "andamento"
        );

        if (totalAndamento >= 2) {
          return res.status(400).json({
            erro: "Limite de 2 tarefas em andamento por usuário atingido",
          });
        }
      }

      const tarefa = await tarefaModel.adicionar({
        texto,
        prioridade,
        coluna,
        usuarioId,
        projetoId,
      });

      res.status(201).json(tarefa);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao criar tarefa" });
    }
  },

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { prioridade, coluna, usuarioId } = req.body;

      if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
        return res.status(400).json({
          erro: "Prioridade inválida. Use: alta, media ou baixa",
        });
      }

      if (coluna && !COLUNAS_VALIDAS.includes(coluna)) {
        return res.status(400).json({
          erro: "Coluna inválida. Use: afazer, andamento ou concluido",
        });
      }

      const tarefaAtual = await tarefaModel.buscar(id);
      if (!tarefaAtual) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
      }

      const idUsuarioEfetivo = usuarioId
        ? parseInt(usuarioId)
        : tarefaAtual.usuario_id;

      if (
        idUsuarioEfetivo &&
        coluna === "andamento" &&
        tarefaAtual.coluna !== "andamento"
      ) {
        const totalAndamento = await tarefaModel.contarPorUsuarioEColuna(
          idUsuarioEfetivo,
          "andamento"
        );

        if (totalAndamento >= 2) {
          return res.status(400).json({
            erro: "Limite de 2 tarefas em andamento por usuário atingido",
          });
        }
      }

      const atualizada = await tarefaModel.atualizar(id, req.body);
      res.json(atualizada);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao atualizar tarefa" });
    }
  },

  async remover(req, res) {
    try {
      const id = parseInt(req.params.id);
      const removida = await tarefaModel.remover(id);

      if (!removida) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
      }

      res.json({ mensagem: "Tarefa removida", tarefa: removida });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao remover tarefa" });
    }
  },

  async estatisticas(req, res) {
    try {
      const dadosEstatisticos = await tarefaModel.obterEstatisticas(
        req.query.coluna
      );
      res.json(dadosEstatisticos);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao obter estatísticas" });
    }
  },
};

module.exports = tarefasController;