const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuario.model");

const authController = {
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: { mensagem: "Email e senha são obrigatórios" } });
      }

      const usuario = await usuarioModel.buscarPorEmail(email);

      if (!usuario || usuario.senha !== senha) {
        return res.status(401).json({ erro: { mensagem: "Credenciais inválidas" } });
      }

      const secret = process.env.JWT_SECRET || "chave_secreta_padrao";

      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome },
        secret,
        { expiresIn: "8h" }
      );

      return res.status(200).json({
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;