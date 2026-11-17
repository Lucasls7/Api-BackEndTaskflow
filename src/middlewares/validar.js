let criarErro;
try {
  criarErro = require('../utils/criarErro');
} catch (e) {
  try {
    criarErro = require('../erros/criarErro');
  } catch (e2) {
    criarErro = require('../criarErro');
  }
}

function validar(schema, origem = 'body') {
  return function (req, res, next) {
    const erros = [];
    const dados = req[origem] || {};

    for (const campo in schema) {
      const regras = schema[campo];
      const valor = dados[campo];
      const ausente = valor === undefined || valor === null || valor === "";

      // 1 — Validação de obrigatoriedade
      if (regras.obrigatorio && ausente) {
        erros.push(`O campo '${campo}' é obrigatório`);
        continue; 
      }

      // Se o campo não foi enviado e não é obrigatório, pula as demais validações
      if (ausente) {
        continue;
      }

      // 2 — Validação de tipo
      if (regras.tipo && typeof valor !== regras.tipo) {
        erros.push(`O campo '${campo}' deve ser do tipo ${regras.tipo}`);
      }
      
      // 3 — Validação de enum
      if (regras.enum && !regras.enum.includes(valor)) {
        erros.push(
          `O campo '${campo}' deve ser um de: ${regras.enum.join(", ")}`,
        );
      }

      // 4 — Validação de formato (ex: email ou inteiro positivo)
      if (regras.formato === "email") {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(valor)) {
          erros.push(`O campo '${campo}' deve ser um email válido`);
        }
      }

      if (regras.formato === "inteiro-positivo") {
        const re = /^\d+$/;
        if (!re.test(valor) || Number(valor) <= 0) {
          erros.push(`O campo '${campo}' deve ser inteiro positivo`);
        }
      }

      // 5 — Validação de tamanho mínimo
      if (regras.minLength && typeof valor === 'string' && valor.length < regras.minLength) {
        erros.push(
          `O campo '${campo}' deve ter ao menos ${regras.minLength} caracteres`,
        );
      }

      // 6 — Validação de tamanho máximo
      if (regras.maxLength && typeof valor === 'string' && valor.length > regras.maxLength) {
        erros.push(
          `O campo '${campo}' deve ter no máximo ${regras.maxLength} caracteres`,
        );
      }
    }

    if (erros.length > 0) {
      throw criarErro(400, 'Dados inválidos', erros);
    }

    next();
  };
}

module.exports = validar;