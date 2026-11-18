const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const prisma = require("../src/database/db");

// Fecha a conexão do Prisma ao final para o Jest encerrar o terminal
afterAll(async () => {
  await prisma.$disconnect();
});

// IDs conhecidos no branch test (confira em Tables no Neon)
const USUARIO_ID = 1;
const PROJETO_ID = 1;
const PRIORIDADE_ID = 1;

const token = jwt.sign({ id: USUARIO_ID, nome: "Teste" }, process.env.JWT_SECRET);

jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

describe("rotas da API", () => {
  // --- TESTES DO DIA 5 (SEM BANCO) ---
  test("GET / responde 200 com o status da API", async () => {
    const resposta = await request(app).get("/");

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual({ status: "API Online" });
  });

  test("rota que não existe responde 404", async () => {
    const resposta = await request(app).get("/nao-existe");

    expect(resposta.status).toBe(404);
    expect(resposta.body.erro.mensagem).toBe("Rota não encontrada");
  });

  test("GET /tarefas sem token responde 401", async () => {
    const resposta = await request(app).get("/tarefas");

    expect(resposta.status).toBe(401);
  });

  test("GET /tarefas com token falso responde 401", async () => {
    const resposta = await request(app)
      .get("/tarefas")
      .set("Authorization", "Bearer abc.def.ghi");

    expect(resposta.status).toBe(401);
  });

  test("POST /tarefas inválido responde 400", async () => {
    const resposta = await request(app)
      .post("/tarefas")
      .set("Authorization", `Bearer ${token}`)
      .send({ texto: "" });

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro.mensagem).toBe("Dados inválidos");
  });

  test("POST /tarefas sem JSON responde 415", async () => {
    const resposta = await request(app)
      .post("/tarefas")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "text/plain")
      .send("texto solto");

    expect(resposta.status).toBe(415);
  });

  // --- TESTES DO DIA 6 (COM BANCO DE TESTE) ---
  test("GET /projetos com token: 200 e uma lista", async () => {
    const resposta = await request(app)
      .get("/projetos")
      .set("Authorization", `Bearer ${token}`);

    expect(resposta.status).toBe(200);
    expect(Array.isArray(resposta.body)).toBe(true);
  });

  test("GET /tarefas com token: 200 e uma lista", async () => {
    const resposta = await request(app)
      .get("/tarefas")
      .set("Authorization", `Bearer ${token}`);

    expect(resposta.status).toBe(200);
    expect(Array.isArray(resposta.body)).toBe(true);
  });

  test("POST /tarefas cria (201), GET /:id busca (200), DELETE remove e GET /:id retorna 404", async () => {
    const nova = {
      texto: "Tarefa criada pelo teste",
      coluna: "afazer",
      usuario_id: USUARIO_ID,
      projeto_id: PROJETO_ID,
      idprioridade: PRIORIDADE_ID,
    };

    // 1. Cria a tarefa
    const criada = await request(app)
      .post("/tarefas")
      .set("Authorization", `Bearer ${token}`)
      .send(nova);

    expect(criada.status).toBe(201);
    expect(criada.body).toHaveProperty("id");

    const idCriado = criada.body.id;

    // 2. Busca a tarefa recém-criada
    const buscada = await request(app)
      .get(`/tarefas/${idCriado}`)
      .set("Authorization", `Bearer ${token}`);

    expect(buscada.status).toBe(200);
    expect(buscada.body.texto).toBe(nova.texto);

    // 3. Remove a tarefa para manter o banco limpo (Regra 2)
    const removida = await request(app)
      .delete(`/tarefas/${idCriado}`)
      .set("Authorization", `Bearer ${token}`);

    expect(removida.status).toBe(200);

    // 4. Confirma que não existe mais após a remoção
    const aposRemover = await request(app)
      .get(`/tarefas/${idCriado}`)
      .set("Authorization", `Bearer ${token}`);

    expect(aposRemover.status).toBe(404);
  });

  test("GET /tarefas/999999 responde 404", async () => {
    const resposta = await request(app)
      .get("/tarefas/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(resposta.status).toBe(404);
    expect(resposta.body.erro.mensagem).toBe("Tarefa não encontrada");
  });
});