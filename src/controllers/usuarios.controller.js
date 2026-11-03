const usuarioModel = require("../models/usuario.model");

const usuariosController = {
  async listar(req, res, next) {
    try {
      const resultado = await usuarioModel.listarUsuarios();
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const usuario = await usuarioModel.buscarPorId(id);

      if (!usuario) {
        return res.status(404).json({ erro: { mensagem: "Usuário não encontrado" } });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  },

  async criar(req, res, next) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ erro: { mensagem: "Nome, email e senha são obrigatórios" } });
      }

      const usuarioExistente = await usuarioModel.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(409).json({ erro: { mensagem: "Este email já está cadastrado" } });
      }

      const novoUsuario = await usuarioModel.criarUsuario({ nome, email, senha });
      return res.status(201).json({
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
      });
    } catch (error) {
      next(error);
    }
  },

  async atualizar(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const usuarioExiste = await usuarioModel.buscarPorId(id);

      if (!usuarioExiste) {
        return res.status(404).json({ erro: { mensagem: "Usuário não encontrado" } });
      }

      const usuarioAtualizado = await usuarioModel.atualizarUsuario(id, req.body);
      return res.status(200).json(usuarioAtualizado);
    } catch (error) {
      next(error);
    }
  },

  async remover(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const usuarioExiste = await usuarioModel.buscarPorId(id);

      if (!usuarioExiste) {
        return res.status(404).json({ erro: { mensagem: "Usuário não encontrado" } });
      }

      await usuarioModel.removerUsuario(id);
      return res.status(200).json({ mensagem: "Usuário removido com sucesso", id });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = usuariosController;