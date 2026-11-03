module.exports = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Insira o token JWT gerado no login'
    }
  },
  schemas: {
    Erro: {
      type: 'object',
      properties: {
        erro: {
          type: 'object',
          properties: {
            mensagem: { type: 'string', example: 'Recurso não encontrado' },
            detalhes: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    }
  }
};