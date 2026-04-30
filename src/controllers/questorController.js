const { Pool } = require('pg');
const redisClient = require('../config/redisClient');

const pool = new Pool({
    host: process.env.HOST_POSTGRESQL,
    port: process.env.PORT_POSTGRESQL,
    database: process.env.DATABASE_POSTGRESQL,
    user: process.env.USER_POSTGRESQL,
    password: process.env.PASSWORD_POSTGRESQL,
});

const getContatos = async (req, res) => {
    const limit = parseInt(req.query.limit) || 0;
    const ignoreCache = req.query.ignoreCache === 'true';
    const user = req.query.user || '';

    const cacheKey = `contatos:user:${user || 'todos'}:limit:${limit || 'sem_limit'}`;

    try {
        const cache = await redisClient.get(cacheKey);

        // Só usa cache se NÃO estiver ignorando
        if (cache && !ignoreCache) {
            return res.status(200).json({
                origem: 'redis',
                dados: JSON.parse(cache),
            });
        }

        const params = [];

        let query = `
      SELECT
        contato.cod_tareffa,                 -- Antiga trib.codigoempresa
        contato.razao_social,
        contato.tributacao,                  -- Antiga trib.caracteristica
        contato.email_geral,
        contato.email_fiscal,
        contato.email_contabil,
        contato.email_dp,
        contato.email_societario,
        contato.email_dp_crt_experiencia,
        contato.email_financeiro,
        contato.cnpj_cpf,                   -- Antiga trib.inscrfederal
        eps.codigo_sindicato,
        eps.nome_sindicato,
        eps.cod_nome,
        contato.remessa_questor
    FROM pex_cadastroestab_contato AS contato
    LEFT JOIN pex_empresa_por_sindicato AS eps
	    ON contato.cod_tareffa = eps.cod_tareffa
    `;

        if (user.length > 0) {
            params.push(user);
            query += ` WHERE contato.cod_tareffa = $${params.length}`;
        }

        if (limit > 0) {
            params.push(limit);
            query += ` LIMIT $${params.length}`;
        }

        const result = await pool.query(query, params);

        await redisClient.setEx(
            cacheKey,
            process.env.REDIS_CACHE_EXPIRATION
            ,
            JSON.stringify(result.rows)
        );

        return res.status(200).json({
            origem: 'postgresql',
            dados: result.rows,
        });

    } catch (error) {
        console.error('Erro ao buscar contatos:', error);

        return res.status(500).json({
            error: 'Erro ao buscar contatos',
            detalhe: error.message,
        });
    }
};

module.exports = {
    getContatos,
};