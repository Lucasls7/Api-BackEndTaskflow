const comum = require('./comum');
const tarefasDocs = require('./tarefas.docs');

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'TaskFlow API',
    version: '1.0.0',
    description: 'API RESTful para gestão de tarefas e projetos — UC14 SENAI'
  },
  servers: [
    {
      url: '/',
      description: 'Servidor Relativo (compatível com Vercel e Localhost)'
    }
  ],
  components: {
    securitySchemes: comum.securitySchemes,
    schemas: comum.schemas
  },
  paths: {
    ...tarefasDocs
  }
};