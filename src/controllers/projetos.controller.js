const projetoModel = require("../models/projeto.model");

const projetosController = {
  async listar(req, res, next) {
    try {
      const usuarioId = req.usuario?.id || req.usuarioId;
      const projetos = await projetoModel.listarProjetos(usuarioId);
      return res.status(200).json(projetos);
    } catch (error) {
      next(error);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const usuarioId = req.usuario?.id || req.usuarioId;
      const projeto = await projetoModel.buscarProjetoPorId(id, usuarioId);

      if (!projeto) {
        return res.status(404).json({ erro: { mensagem: "Projeto não encontrado" } });
      }

      return res.status(200).json(projeto);
    } catch (error) {
      next(error);
    }
  },

  async criar(req, res, next) {
    try {
      const { nome, descricao } = req.body;
      const usuarioId = req.usuario?.id || req.usuarioId;

      if (!nome) {
        return res.status(400).json({ erro: { mensagem: "O nome do projeto é obrigatório" } });
      }

      const novoProjeto = await projetoModel.criarProjeto({ nome, descricao, usuarioId });
      return res.status(201).json(novoProjeto);
    } catch (error) {
      next(error);
    }
  },

  async atualizar(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const usuarioId = req.usuario?.id || req.usuarioId;

      const projetoExiste = await projetoModel.buscarProjetoPorId(id, usuarioId);
      if (!projetoExiste) {
        return res.status(404).json({ erro: { mensagem: "Projeto não encontrado" } });
      }

      await projetoModel.atualizarProjeto(id, usuarioId, req.body);
      const atualizado = await projetoModel.buscarProjetoPorId(id, usuarioId);
      return res.status(200).json(atualizado);
    } catch (error) {
      next(error);
    }
  },

  async remover(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const usuarioId = req.usuario?.id || req.usuarioId;

      const projetoExiste = await projetoModel.buscarProjetoPorId(id, usuarioId);
      if (!projetoExiste) {
        return res.status(404).json({ erro: { mensagem: "Projeto não encontrado" } });
      }

      await projetoModel.removerProjeto(id, usuarioId);
      return res.status(200).json({ mensagem: "Projeto removido com sucesso", id });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = projetosController;