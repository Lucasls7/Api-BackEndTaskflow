const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuario.model");

const authController = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios" });
      }

      const usuario = await usuarioModel.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).json({ erro: "Credenciais inválidas" });
      }

      if (usuario.senha !== senha) {
        return res.status(401).json({ erro: "Credenciais inválidas" });
      }

      const secret = process.env.JWT_SECRET || "chave_secreta_padrao";
      
      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome },
        secret,
        { expiresIn: "8h" }
      );

      return res.json({
        token,
        usuario: { id: usuario.id, nome: usuario.nome },
      });
    } catch (error) {
      console.error("Erro interno no login:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  },
};

module.exports = authController;