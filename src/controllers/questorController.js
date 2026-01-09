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
    const user = parseInt(req.query.user) || 0;

    let query = `
            SELECT 
                contato.cod_tareffa, --Antiga trib.codigoempresa 
                contato.razao_social, 
                contato.tributacao, --Antiga trib.caracteristica
                contato.email_geral, 
                contato.email_fiscal, 
                contato.email_contabil, 
                contato.email_dp, 
                contato.email_societario, 
                contato.email_dp_crt_experiencia, 
                contato.email_financeiro,
                contato.cnpj_cpf, --Antiga trib.inscrfederal
                eps.codigo_sindicato,
                eps.nome_sindicato,
                eps.cod_nome
            FROM pex_cadastroestab_contato AS contato
            LEFT JOIN pex_empresa_por_sindicato AS eps
            ON contato.cod_tareffa = eps.cod_tareffa
  `;

    if (limit > 0) {
        query += ` LIMIT ${limit}`;
    }
    if (user > 0) {
        query += `  WHERE codigoempresa= ${user}`;
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