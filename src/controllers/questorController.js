// Importa o cliente do PostgreSQL
const { Pool } = require('pg');

// Configuração da conexão
const pool = new Pool({
    host: process.env.HOST_POSTGRESQL,
    port: process.env.PORT_POSTGRESQL,
    database: process.env.DATABASE_POSTGRESQL,
    user: process.env.USER_POSTGRESQL,
    password: process.env.PASSWORD_POSTGRESQL,
});

/// Função para buscar dados de tributações + contatos
const getContatos = async (req, res) => {
    const limit = parseInt(req.query.limit) || 0;

    let query = `
    SELECT
      trib.codigoempresa,
      contato.razao_social,
      trib.caracteristica,
      contato.email_geral,
      contato.email_fiscal,
      contato.email_contabil,
      contato.email_dp,
      contato.email_societario,
      contato.email_dp_crt_experiencia,
      contato.email_financeiro
    FROM pex_tributacao_empresas AS trib
    INNER JOIN pex_cadastroestab_contato AS contato
      ON trib.codigoempresa = contato.cod_questor
  `;

    if (limit > 0) {
        query += ` LIMIT ${limit}`;
    }

    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar tributações:', error);
        res.status(500).json({ error: 'Erro ao buscar tributações' });
    }
};


module.exports = {
    getContatos
};