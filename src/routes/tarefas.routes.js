const express = require("express");
const router = express.Router();
const tarefasController = require("../controllers/tarefas.controller");

const validar = require("../middlewares/validar");
const schemas = require("../middlewares/schemas");

router.get("/estatisticas", tarefasController.estatisticas);

// Rotas CRUD
router.get("/", tarefasController.listar);
router.post("/", validar(schemas.tarefa), tarefasController.criar);
router.get("/:id", tarefasController.buscarPorId);
router.put("/:id", tarefasController.atualizar);
router.delete("/:id", tarefasController.remover);

module.exports = router;