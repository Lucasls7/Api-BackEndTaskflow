require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./src/database/db");
pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("Erro ao conectar:", err.message);
  else console.log("Banco conectado:", res.rows[0].now);
});

const logger = require("./src/middlewares/logger");
const validarContentType = require("./src/middlewares/validarContentType");
const temporizador = require("./src/middlewares/temporizador");
const autenticar = require("./src/middlewares/autenticar");

const tarefasRoutes = require("./src/routes/tarefas.Routes");
const usuariosRoutes = require("./src/routes/usuarios.Routes");
const projetosRoutes = require("./src/routes/projetos.Routes");
const authRoutes = require("./src/routes/auth.routes");

const app = express();

const PORT = process.env.PORT || process.env.PORTA || 3000;

const allowedOrigins = [
  "https://frontendtasklow.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.CORS_ORIGIN === "*") {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
  })
);


app.use(express.json());

app.use(logger);
app.use(temporizador);
app.use(validarContentType);

app.get("/", (req, res) => {
  res.status(200).json({ status: "API Online" });
});

app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/tarefas", autenticar, tarefasRoutes);
app.use("/projetos", autenticar, projetosRoutes);

app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
  });
});

app.use((err, req, res, next) => {
  console.error("Erro interno capturado:", err.stack || err);
  res.status(500).json({
    erro: "Erro interno no servidor",
    mensagem: process.env.NODE_ENV !== "production" ? err.message : undefined,
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
}

module.exports = app;