// const projetoModel = require("../models/projeto.model");

// const projetosController = {
//   listar(req, res) {
//     const { descricao } = req.query;
//     let resposta = projetoModel.listar();

//     if (descricao) {
//       resposta = resposta.filter((p) => p.descricao === descricao);
//     }

//     res.json(resposta);
//   },

//   buscarPorId(req, res) {
//     const projeto = projetoModel.buscar(parseInt(req.params.id));

//     if (!projeto) {
//       return res.status(404).json({ erro: "Projeto não encontrado" });
//     }

//     res.json(projeto);
//   },

//   criar(req, res) {
//     const novoProjeto = projetoModel.adicionar(req.body);
//     res.status(201).json(novoProjeto);
//   },

//   atualizar(req, res) {
//     const id = parseInt(req.params.id);
//     const projetoAtualizado = projetoModel.atualizar(id, req.body);

//     if (!projetoAtualizado) {
//       return res.status(404).json({ erro: "Projeto não encontrado" });
//     }

//     res.json(projetoAtualizado);
//   },

//   remover(req, res) {
//     const id = parseInt(req.params.id);
//     const removido = projetoModel.remover(id);

//     if (!removido) {
//       return res.status(404).json({ erro: "Projeto não encontrado" });
//     }

//     res.json({ mensagem: "Projeto removido com sucesso", id });
//   },
// };

// module.exports = projetosController;






const projetoModel = require("../models/projeto.model");

const projetosController = {
  async listar(req, res) {
    try {
      const { descricao } = req.query;
      let resposta = await projetoModel.listar();

      if (descricao) {
        resposta = resposta.filter((p) =>
          p.descricao.toLowerCase().includes(descricao.toLowerCase())
        );
      }

      res.json(resposta);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao listar projetos" });
    }
  },

  async buscarPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const projeto = await projetoModel.buscar(id);

      if (!projeto) {
        return res.status(404).json({ erro: "Projeto não encontrado" });
      }

      res.json(projeto);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao buscar projeto" });
    }
  },

  async criar(req, res) {
    try {
      const { descricao, ativo } = req.body;

      if (!descricao) {
        return res.status(400).json({ erro: "A descrição é obrigatória" });
      }

      const novoProjeto = await projetoModel.adicionar({ descricao, ativo });
      res.status(201).json(novoProjeto);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao criar projeto" });
    }
  },

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);

      const projetoExiste = await projetoModel.buscar(id);
      if (!projetoExiste) {
        return res.status(404).json({ erro: "Projeto não encontrado" });
      }

      const projetoAtualizado = await projetoModel.atualizar(id, req.body);
      res.json(projetoAtualizado);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao atualizar projeto" });
    }
  },

  async remover(req, res) {
    try {
      const id = parseInt(req.params.id);

      const projetoExiste = await projetoModel.buscar(id);
      if (!projetoExiste) {
        return res.status(404).json({ erro: "Projeto não encontrado" });
      }

      const removido = await projetoModel.remover(id);
      res.json({ mensagem: "Projeto removido com sucesso", projeto: removido });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao remover projeto" });
    }
  },
};

module.exports = projetosController;