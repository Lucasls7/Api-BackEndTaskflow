// const usuarioModel = require("../models/usuario.model");
// const tarefaModel = require("../models/tarefa.model");

// const usuariosController = {
//   listar(req, res) {
//     // Repassa os filtros de req.query diretamente para o Model
//     const resultado = usuarioModel.listar(req.query);
//     res.json(resultado);
//   },

//   buscarPorId(req, res) {
//     const usuario = usuarioModel.buscar(parseInt(req.params.id));

//     if (!usuario) {
//       return res.status(404).json({ erro: "Usuario não encontrado" });
//     }

//     res.json(usuario);
//   },

//   criar(req, res) {
//     const { email } = req.body;

//     if (email && usuarioModel.buscarPorEmail(email)) {
//       return res.status(400).json({
//         erro: "Este email já está cadastrado",
//       });
//     }

//     const novoUsuario = usuarioModel.adicionar(req.body);
//     res.status(201).json(novoUsuario);
//   },

//   atualizar(req, res) {
//     const id = parseInt(req.params.id);
//     const usuarioAtualizado = usuarioModel.atualizar(id, req.body);

//     if (!usuarioAtualizado) {
//       return res.status(404).json({ erro: "Usuario não encontrado" });
//     }

//     res.json(usuarioAtualizado);
//   },

//   remover(req, res) {
//     const id = parseInt(req.params.id);

//     const usuario = usuarioModel.buscar(id);
//     if (!usuario) {
//       return res.status(404).json({ erro: "Usuario não encontrado" });
//     }

//     // O Model calcula se existem tarefas do usuário
//     const qtdTarefas = tarefaModel.contarPorUsuario(id);

//     if (qtdTarefas > 0) {
//       return res.status(400).json({
//         erro: "Usuário possui tarefas. Remova as tarefas antes.",
//       });
//     }

//     usuarioModel.remover(id);

//     res.json({ mensagem: "usuario removido com sucesso", id });
//   },
// };

// module.exports = usuariosController;













  const usuarioModel = require("../models/usuario.model");
const tarefaModel = require("../models/tarefa.model");

const usuariosController = {
  async listar(req, res) {
    try {
      const resultado = await usuarioModel.listar(req.query);
      res.json(resultado);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao listar usuários" });
    }
  },

  async buscarPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const usuario = await usuarioModel.buscar(id);

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      res.json(usuario);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao buscar usuário" });
    }
  },

  async criar(req, res) {
    try {
      const { email } = req.body;

      if (email) {
        const usuarioExistente = await usuarioModel.buscarPorEmail(email);
        if (usuarioExistente) {
          return res.status(400).json({
            erro: "Este email já está cadastrado",
          });
        }
      }

      const novoUsuario = await usuarioModel.adicionar(req.body);
      res.status(201).json(novoUsuario);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao criar usuário" });
    }
  },

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);

      const usuarioExiste = await usuarioModel.buscar(id);
      if (!usuarioExiste) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      const usuarioAtualizado = await usuarioModel.atualizar(id, req.body);
      res.json(usuarioAtualizado);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
  },

  async remover(req, res) {
    try {
      const id = parseInt(req.params.id);

      const usuario = await usuarioModel.buscar(id);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      // Verifica no banco se existem tarefas associadas ao usuário
      if (tarefaModel.contarPorUsuario) {
        const qtdTarefas = await tarefaModel.contarPorUsuario(id);
        if (qtdTarefas > 0) {
          return res.status(400).json({
            erro: "Usuário possui tarefas. Remova as tarefas antes.",
          });
        }
      }

      const removido = await usuarioModel.remover(id);
      res.json({ mensagem: "Usuário removido com sucesso", usuario: removido });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao remover usuário" });
    }
  },
};

module.exports = usuariosController;