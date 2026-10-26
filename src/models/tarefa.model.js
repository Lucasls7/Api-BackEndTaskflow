const pool = require('../database/db');

module.exports = {
  listar: async ({ coluna, prioridade, usuarioId } = {}) => {
    let sql = 'SELECT * FROM tarefas WHERE 1=1';
    const params = [];

    if (usuarioId !== undefined) {
      params.push(usuarioId);
      sql += ` AND usuario_id = $${params.length}`;
    }
    if (coluna) {
      params.push(coluna);
      sql += ` AND coluna = $${params.length}`;
    }
    if (prioridade) {
      params.push(prioridade);
      sql += ` AND prioridade = $${params.length}`;
    }

    sql += ' ORDER BY id ASC';
    const { rows } = await pool.query(sql, params);
    return rows;
  },

  listarPorColuna: async (coluna) => {
    const { rows } = await pool.query(
      'SELECT * FROM tarefas WHERE coluna = $1 ORDER BY id ASC',
      [coluna]
    );
    return rows;
  },

  listarPorPrioridade: async (prioridade) => {
    const { rows } = await pool.query(
      'SELECT * FROM tarefas WHERE prioridade = $1 ORDER BY id ASC',
      [prioridade]
    );
    return rows;
  },

  buscar: async (id) => {
    const { rows } = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
    return rows[0] || null;
  },

  contarPorUsuario: async (usuarioId) => {
    const { rows } = await pool.query(
      'SELECT COUNT(*)::int AS total FROM tarefas WHERE usuario_id = $1',
      [usuarioId]
    );
    return rows[0].total;
  },

  contarPorUsuarioEColuna: async (usuarioId, coluna) => {
    const { rows } = await pool.query(
      'SELECT COUNT(*)::int AS total FROM tarefas WHERE usuario_id = $1 AND coluna = $2',
      [usuarioId, coluna]
    );
    return rows[0].total;
  },

  adicionar: async ({ texto, prioridade, coluna, cidade, usuarioId }) => {
    const novaColuna = coluna || 'afazer';
    const concluidaEm = novaColuna === 'concluido' ? new Date() : null;

    const sql = `
      INSERT INTO tarefas (texto, prioridade, coluna, cidade, usuario_id, concluida_em)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      texto,
      prioridade || 'media',
      novaColuna,
      cidade || '',
      usuarioId,
      concluidaEm,
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
  },

  atualizar: async (id, dados) => {
    let sqlConcluido = '';
    if (dados.coluna !== undefined) {
      sqlConcluido =
        dados.coluna === 'concluido'
          ? ', concluida_em = NOW()'
          : ', concluida_em = NULL';
    }

    const sql = `
      UPDATE tarefas
      SET texto = COALESCE($1, texto),
          prioridade = COALESCE($2, prioridade),
          coluna = COALESCE($3, coluna),
          cidade = COALESCE($4, cidade)
          ${sqlConcluido}
      WHERE id = $5
      RETURNING *;
    `;

    const { rows } = await pool.query(sql, [
      dados.texto,
      dados.prioridade,
      dados.coluna,
      dados.cidade,
      id,
    ]);
    return rows[0] || null;
  },

  remover: async (id) => {
    const { rows } = await pool.query(
      'DELETE FROM tarefas WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },

  obterEstatisticas: async (coluna) => {
    let filtro = '';
    const params = [];

    if (coluna) {
      params.push(coluna);
      filtro = 'WHERE coluna = $1';
    }

    const sql = `
      SELECT 
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE coluna = 'afazer')::int AS total_afazer,
        COUNT(*) FILTER (WHERE coluna = 'andamento')::int AS total_andamento,
        COUNT(*) FILTER (WHERE coluna = 'concluido')::int AS total_concluido,
        COUNT(*) FILTER (WHERE prioridade = 'alta')::int AS total_alta,
        COUNT(*) FILTER (WHERE prioridade = 'media')::int AS total_media,
        COUNT(*) FILTER (WHERE prioridade = 'baixa')::int AS total_baixa
      FROM tarefas
      ${filtro};
    `;

    const { rows } = await pool.query(sql, params);
    const r = rows[0];

    const porColuna = {
      afazer: r.total_afazer,
      andamento: r.total_andamento,
      concluido: r.total_concluido,
    };

    const colunaMaisTarefas = Object.entries(porColuna).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    return {
      total: r.total,
      porColuna,
      porPrioridade: {
        alta: r.total_alta,
        media: r.total_media,
        baixa: r.total_baixa,
      },
      colunaMaisTarefas,
    };
  },
};