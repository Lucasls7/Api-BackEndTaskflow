const tarefaModel = require("../models/tarefa.model");

const PRIORIDADES_VALIDAS = ["alta", "media", "baixa"];
const COLUNAS_VALIDAS = ["afazer", "andamento", "concluido"];

const tarefasController = {
  async listar(req, res, next) {
    try {
      const usuarioId = req.usuario?.id || req.usuarioId;
      const resultado = await tarefaModel.listar(usuarioId);
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const usuarioId = req.usuario?.id || req.usuarioId;
      const tarefa = await tarefaModel.buscarPorId(id, usuarioId);

      if (!tarefa) {
        return res.status(404).json({ erro: { mensagem: "Tarefa não encontrada" } });
      }

      return res.status(200).json(tarefa);
    } catch (error) {
      next(error);
    }
  },

  async criar(req, res, next) {
    try {
      const { titulo, texto, prioridade, coluna, projetoId, descricao } = req.body;
      const usuarioId = req.usuario?.id || req.usuarioId;

      const tituloFinal = titulo || texto;
      if (!tituloFinal) {
        return res.status(400).json({ erro: { mensagem: "Título/Texto da tarefa é obrigatório" } });
      }

      if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
        return res.status(400).json({
          erro: { mensagem: "Prioridade inválida. Use: alta, media ou baixa" },
        });
      }

      if (coluna && !COLUNAS_VALIDAS.includes(coluna)) {
        return res.status(400).json({
          erro: { mensagem: "Coluna inválida. Use: afazer, andamento ou concluido" },
        });
      }

      const tarefa = await tarefaModel.criar({
        titulo: tituloFinal,
        descricao,
        prioridade,
        coluna,
        usuarioId,
        projetoId: projetoId ? parseInt(projetoId) : null,
      });

      return res.status(201).json(tarefa);
    } catch (error) {
      next(error);
    }
  },

  async atualizar(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const usuarioId = req.usuario?.id || req.usuarioId;
      const { prioridade, coluna } = req.body;

      if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
        return res.status(400).json({
          erro: { mensagem: "Prioridade inválida. Use: alta, media ou baixa" },
        });
      }

      if (coluna && !COLUNAS_VALIDAS.includes(coluna)) {
        return res.status(400).json({
          erro: { mensagem: "Coluna inválida. Use: afazer, andamento ou concluido" },
        });
      }

      const tarefaAtual = await tarefaModel.buscarPorId(id, usuarioId);
      if (!tarefaAtual) {
        return res.status(404).json({ erro: { mensagem: "Tarefa não encontrada" } });
      }

      await tarefaModel.atualizar(id, usuarioId, req.body);
      const atualizada = await tarefaModel.buscarPorId(id, usuarioId);

      return res.status(200).json(atualizada);
    } catch (error) {
      next(error);
    }
  },

  async remover(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const usuarioId = req.usuario?.id || req.usuarioId;

      const tarefa = await tarefaModel.buscarPorId(id, usuarioId);
      if (!tarefa) {
        return res.status(404).json({ erro: { mensagem: "Tarefa não encontrada" } });
      }

      await tarefaModel.remover(id, usuarioId);
      return res.status(200).json({ mensagem: "Tarefa removida com sucesso", id });
    } catch (error) {
      next(error);
    }
  },

  async estatisticas(req, res, next) {
    try {
      const usuarioId = req.usuario?.id || req.usuarioId;
      const tarefas = await tarefaModel.listar(usuarioId);

      const colunaFiltro = req.query.coluna;
      let resultadoTarefas = tarefas;

      if (colunaFiltro && COLUNAS_VALIDAS.includes(colunaFiltro)) {
        resultadoTarefas = tarefas.filter((t) => t.coluna === colunaFiltro);
      }

      const estatisticas = {
        total: resultadoTarefas.length,
        concluidas: resultadoTarefas.filter(
          (t) => t.concluida || t.coluna === "concluido"
        ).length,
        pendentes: resultadoTarefas.filter(
          (t) => !t.concluida && t.coluna !== "concluido"
        ).length,
      };

      return res.status(200).json(estatisticas);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = tarefasController;