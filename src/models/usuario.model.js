// let usuarios = [
//   { id: 1, nome: "admin", email: "admin@email.com", senha: "1234" }
// ];

// let proximoId = 2;

// module.exports = {
//   listar: ({ nome, email } = {}) => {
//     let resultado = usuarios;

//     if (nome) {
//       resultado = resultado.filter((u) => u.nome === nome);
//     }
//     if (email) {
//       resultado = resultado.filter((u) => u.email === email);
//     }

//     return resultado;
//   },

//   buscar: (id) => usuarios.find((u) => u.id === id),

//   buscarPorEmail: (email) => usuarios.find((u) => u.email === email),

//   adicionar: ({ nome, email, senha }) => {
//     const novo = {
//       id: proximoId++,
//       nome: nome || "lucas",
//       email: email || "admin@email.com",
//       senha: senha || "1234",
//     };
//     usuarios.push(novo);
//     return novo;
//   },

//   atualizar: (id, dados) => {
//     const idx = usuarios.findIndex((u) => u.id === id);
//     if (idx === -1) return null;

//     usuarios[idx] = { id, ...dados };
//     return usuarios[idx];
//   },

//   remover: (id) => {
//     const idx = usuarios.findIndex((u) => u.id === id);
//     if (idx === -1) return null;

//     return usuarios.splice(idx, 1)[0];
//   },
// };













const pool = require('../database/db');

module.exports = {
  listar: async ({ nome, email } = {}) => {
    let query = 'SELECT * FROM usuarios WHERE 1=1';
    const values = [];

    if (nome) {
      values.push(`%${nome}%`);
      query += ` AND nome ILIKE $${values.length}`;
    }

    if (email) {
      values.push(email);
      query += ` AND email = $${values.length}`;
    }

    query += ' ORDER BY id';

    const result = await pool.query(query, values);
    return result.rows;
  },

  buscar: async (id) => {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  buscarPorEmail: async (email) => {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  },

  adicionar: async ({ nome, email, senha }) => {
    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, senha) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [nome || 'lucas', email || 'admin@email.com', senha || '1234']
    );
    return result.rows[0];
  },

  atualizar: async (id, dados) => {
    const { nome, email, senha } = dados;
    const result = await pool.query(
      `UPDATE usuarios 
       SET nome = $1, email = $2, senha = $3 
       WHERE id = $4 
       RETURNING *`,
      [nome, email, senha, id]
    );
    return result.rows[0] || null;
  },

  remover: async (id) => {
    const result = await pool.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  },
};