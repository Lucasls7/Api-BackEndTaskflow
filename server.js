const app = require("./app");
const prisma = require("./src/database/db");

const PORT = process.env.PORT || process.env.PORTA || 3000;

prisma
  .$connect()
  .then(() => console.log("Banco de dados conectado via Prisma!"))
  .catch((err) => console.error("Erro ao conectar no banco:", err.message));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});