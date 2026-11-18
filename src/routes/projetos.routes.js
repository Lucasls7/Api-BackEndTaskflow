const express = require('express');
const router = express.Router();
const projetosController = require('../controllers/projetos.controller');
const validarRequest = require('../middlewares/validar');

router.get('/', projetosController.listar);

// Valida se o :id na URL é um inteiro positivo válido usando o schema 'id'
router.get('/:id', validarRequest('id', 'params'), projetosController.buscarPorId);

// Valida o body com 'projeto'
router.post('/', validarRequest('projeto', 'body'), projetosController.criar);

// Valida tanto o ID na URL quanto o body na atualização
router.put(
  '/:id', 
  validarRequest('id', 'params'), 
  validarRequest('projeto', 'body'), 
  projetosController.atualizar
);

// Valida o ID na URL antes de remover
router.delete('/:id', validarRequest('id', 'params'), projetosController.remover);

module.exports = router;