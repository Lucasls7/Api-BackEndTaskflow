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

const pool = require('./src/database/db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Erro ao conectar:', err.message);
  else console.log('Banco conectado:', res.rows[0].now);
});


const allowedOrigins = [
  "https://frontendtasklow.vercel.app",
  process.env.CORS_ORIGIN
].filter(Boolean); 

const corsOptions = {
  origin: function (origin, callback) {
 
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      callback(null, true); 
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 

app.use(express.json());

app.use((req, res, next) => {
  if (req.method === "OPTIONS" || req.method === "GET") {
    return next();
  }
  validarContentType(req, res, next);
});

app.use(logger);
app.use(temporizador);

app.get("/", (req, res) => {
  res.json({ mensagem: "API do TaskFlow rodando com sucesso!" });
});

app.use("/auth", authRoutes);
app.use("/usuarios", autenticar, usuariosRoutes);
app.use("/tarefas", autenticar, tarefasRoutes);
app.use("/projetos", autenticar, projetosRoutes);

app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
  });
});

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}`));
}