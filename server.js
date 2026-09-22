require("dotenv").config();

const express = require("express");
const cors = require("cors");

const logger = require("./src/middlewares/logger");
const validarContentType = require("./src/middlewares/validarContentType");
const temporizador = require("./src/middlewares/temporizador");
const autenticar = require("./src/middlewares/autenticar");

const tarefasRoutes = require("./src/routes/tarefas.routes");
const usuariosRoutes = require("./src/routes/usuarios.routes");
const projetosRoutes = require("./src/routes/projetos.routes");
const authRoutes = require("./src/routes/auth.routes");

const app = express();
const PORTA = process.env.PORTA || 3000;

// Configuração do CORS aberta para testes
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);

app.use(express.json());
app.use(validarContentType);
app.use(logger);
app.use(temporizador);

// Rota inicial de teste (Health Check) para ver se a API está no ar
app.get("/", (req, res) => {
  res.json({ mensagem: "API do TaskFlow rodando com sucesso!" });
});

// Rotas da aplicação
app.use("/auth", authRoutes);
app.use("/usuarios", autenticar, usuariosRoutes);
app.use("/tarefas", autenticar, tarefasRoutes);
app.use("/projetos", autenticar, projetosRoutes);

// Tratamento para rotas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
  });
});

// Exporta o app para a Vercel
module.exports = app;

// Roda localmente apenas fora da produção
if (process.env.NODE_ENV !== "production") {
  app.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}`));
}