require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

// Conexão e teste do banco via Prisma Client
const prisma = require("./src/database/db");

prisma
  .$connect()
  .then(() => console.log("Banco de dados conectado via Prisma!"))
  .catch((err) => console.error("Erro ao conectar no banco:", err.message));

// Especificação da Documentação Swagger / OpenAPI
const openapiSpec = require("./src/docs/openapi");

const logger = require("./src/middlewares/logger");
const validarContentType = require("./src/middlewares/validarContentType");
const temporizador = require("./src/middlewares/temporizador");
const autenticar = require("./src/middlewares/autenticar");

const tarefasRoutes = require("./src/routes/tarefas.routes");
const usuariosRoutes = require("./src/routes/usuarios.routes");
const projetosRoutes = require("./src/routes/projetos.routes");
const authRoutes = require("./src/routes/auth.routes");

const app = express();

const PORT = process.env.PORT || process.env.PORTA || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

app.use(express.json());

app.use(logger);
app.use(temporizador);
app.use(validarContentType);

// Rota da Documentação Swagger (com CSS via CDN para Vercel)
const SWAGGER_CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openapiSpec, { customCssUrl: SWAGGER_CSS_URL })
);

// Rota base de verificação da API
app.get("/", (req, res) => {
  res.status(200).json({ status: "API Online" });
});

// Definição das rotas
app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/tarefas", autenticar, tarefasRoutes);
app.use("/projetos", autenticar, projetosRoutes);

// Rota 404 (Recurso Não Encontrado)
app.use((req, res) => {
  res.status(404).json({
    erro: {
      mensagem: "Rota não encontrada",
    },
  });
});

// Middleware Centralizado de Tratamento de Erros
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const mensagem = err.mensagem || err.message || "Erro interno do servidor";

  res.status(status).json({
    erro: {
      mensagem,
      detalhes: err.detalhes || undefined,
    },
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`Servidor rodando em http://localhost:${PORT}`)
  );
}

module.exports = app;