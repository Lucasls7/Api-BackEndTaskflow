module.exports = {
  '/tarefas': {
    get: {
      tags: ['Tarefas'],
      summary: 'Lista todas as tarefas do utilizador autenticado',
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'Lista de tarefas retornada com sucesso' },
        401: { description: 'Não autorizado' }
      }
    },
    post: {
      tags: ['Tarefas'],
      summary: 'Cria uma nova tarefa',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['titulo'],
              properties: {
                titulo: { type: 'string', example: 'Comprar insumos' },
                descricao: { type: 'string', example: 'Comprar componentes no fornecedor' },
                projetoId: { type: 'integer', example: 1 }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Tarefa criada com sucesso' },
        400: { description: 'Dados de entrada inválidos' }
      }
    }
  }
};