const pool = require('../database/db');

module.exports = {
  listar: async () => {
    const { rows } = await pool.query('SELECT * FROM projetos ORDER BY id ASC');
    return rows;
  },

  buscar: async (id) => {
    const { rows } = await pool.query('SELECT * FROM projetos WHERE id = $1', [id]);
    return rows[0] || null;
  },

  adicionar: async ({ descricao, ativo }) => {
    const sql = `
      INSERT INTO projetos (descricao, ativo)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [
      descricao || 'teste esse projeto',
      ativo !== undefined ? ativo : true,
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
  },

  atualizar: async (id, dados) => {
    const sql = `
      UPDATE projetos 
      SET descricao = COALESCE($1, descricao),
          ativo = COALESCE($2, ativo)
      WHERE id = $3
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, [dados.descricao, dados.ativo, id]);
    return rows[0] || null;
  },

  remover: async (id) => {
    const { rows } = await pool.query(
      'DELETE FROM projetos WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },
};