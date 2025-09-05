const Firebird = require('node-firebird')

// Configuração da conexão Firebird
const options = {
    host: '192.168.124.99',
    port: 3050,
    database: 'questor',
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: true,
};

//Controller que busca Contatos
const getContatos = (req, res) => {
    Firebird.attach(options, function (err, db) {
        const limit = parseInt(req.query.limit) || 0;
        const tabela = req.query.tabela || 'null'
        let getLimitsText;
        let getTable;
        let query;
        if (err) {
            console.error('Erro ao conectar', err);
            return res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
        }

        if (limit > 0) {
            getLimitsText = ` FIRST ${limit} `
        } else {
            getLimitsText = "";
        }

        if (tabela === 'all') {
            getTable = `
                SELECT ${getLimitsText} TRIM(RDB$RELATION_NAME) AS NOME_DAS_TABELAS
                            FROM RDB$RELATIONS
                            WHERE RDB$SYSTEM_FLAG = 0
                            AND RDB$VIEW_BLR IS NULL
                            ORDER BY RDB$RELATION_NAME;
                `
        } else {

            //getLimitsText
            getTable = `
                SELECT ${getLimitsText}
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
                ON trib.codigoempresa = contato.cod_questor;
            `;
        }

        query = getTable;
                
        db.query(query, (err, result) => {
            db.detach(); //Libera a conexão com o banco de dados

            if (err) {
                console.error('Erro na consulta', err);
                return res.status(500).json({ error: 'Erro ao executar a consulta SQL.' });
            }
            res.status(200).json(result);
        });
    });
};

module.exports = {
    getContatos
};