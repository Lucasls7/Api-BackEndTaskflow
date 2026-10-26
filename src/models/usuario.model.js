const pool = require('../database/db');

module.exports = {
  listar: async ({ nome, email } = {}) => {
    let sql = 'SELECT * FROM usuarios WHERE 1=1';
    const params = [];

    if (nome) {
      params.push(nome);
      sql += ` AND nome = $${params.length}`;
    }
    if (email) {
      params.push(email);
      sql += ` AND email = $${params.length}`;
    }

    sql += ' ORDER BY id ASC';
    const { rows } = await pool.query(sql, params);
    return rows;
  },

  buscar: async (id) => {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return rows[0] || null;
  },

  buscarPorEmail: async (email) => {
    const { rows } = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    return rows[0] || null;
  },

  adicionar: async ({ nome, email, senha }) => {
    const sql = `
      INSERT INTO usuarios (nome, email, senha)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [
      nome || 'lucas',
      email || 'admin@email.com',
      senha || '1234',
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
  },

  atualizar: async (id, dados) => {
    const sql = `
      UPDATE usuarios
      SET nome = COALESCE($1, nome),
          email = COALESCE($2, email),
          senha = COALESCE($3, senha)
      WHERE id = $4
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, [
      dados.nome,
      dados.email,
      dados.senha,
      id,
    ]);
    return rows[0] || null;
  },

  remover: async (id) => {
    const { rows } = await pool.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },
};