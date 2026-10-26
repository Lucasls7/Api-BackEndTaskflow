// let projetos = [{ id: 1, descricao: "Projetos para fazer logo", ativo: true }];

// let proximoId = 2;

// module.exports = {
//   listar: () => projetos,

//   buscar: (id) => projetos.find((p) => p.id === id),

//   adicionar: ({ descricao, ativo }) => {
//     const novo = {
//       id: proximoId++,
//       descricao: descricao || "teste esse projeto",
//       ativo: ativo !== undefined ? ativo : true,
//     };
//     projetos.push(novo);
//     return novo;
//   },

//   atualizar: (id, dados) => {
//     const idx = projetos.findIndex((p) => p.id === id);
//     if (idx === -1) return null;

//     projetos[idx] = { id, ...dados };
//     return projetos[idx];
//   },

//   remover: (id) => {
//     const idx = projetos.findIndex((p) => p.id === id);
//     if (idx === -1) return null;

//     return projetos.splice(idx, 1)[0];
//   },
// };






const pool = require('../database/db');

module.exports = {
  listar: async () => {
    const result = await pool.query(
      'SELECT * FROM projetos ORDER BY id'
    );
    return result.rows;
  },

  buscar: async (id) => {
    const result = await pool.query(
      'SELECT * FROM projetos WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  adicionar: async ({ descricao, ativo }) => {
    const result = await pool.query(
      `INSERT INTO projetos (descricao, ativo) 
       VALUES ($1, $2) 
       RETURNING *`,
      [
        descricao || 'teste esse projeto',
        ativo !== undefined ? ativo : true,
      ]
    );
    return result.rows[0];
  },

  atualizar: async (id, dados) => {
    const { descricao, ativo } = dados;
    const result = await pool.query(
      `UPDATE projetos 
       SET descricao = $1, ativo = $2 
       WHERE id = $3 
       RETURNING *`,
      [descricao, ativo, id]
    );
    return result.rows[0] || null;
  },

  remover: async (id) => {
    const result = await pool.query(
      'DELETE FROM projetos WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  },
};