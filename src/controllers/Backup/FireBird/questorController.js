const Firebird = require('node-firebird')

// Configuração da conexão Firebird
const options = {
    host: process.env.HOST,
    port: process.env.PORT || process.env.PORT2,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
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

        //Modo Padrão
        if (tabela === 'null') {
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
                ON trib.codigoempresa = contato.cod_questor;`;
        } else if (tabela === 'all') {
            getTable = `SELECT ${getLimitsText} TRIM(RDB$RELATION_NAME) AS NOME_DAS_TABELAS
                            FROM RDB$RELATIONS
                            WHERE RDB$SYSTEM_FLAG = 0
                            AND RDB$VIEW_BLR IS NULL
                            ORDER BY RDB$RELATION_NAME;`
        } else {
            getTable = `SELECT ${getLimitsText} * FROM ${tabela}`
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


//Lista os nomes da coluna de uma Tabela
const getConsultaDados = (req, res) => {
    Firebird.attach(options, function (err, db) {
        const limit = parseInt(req.query.limit) || 0;
        const consulta = req.query.consulta || 'null'
        let getTable;
        if (err) {
            console.error('Erro ao conectar', err);
            return res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
        }

        if (limit > 0) {
            getLimitsText = ` FIRST ${limit} `
        } else {
            getLimitsText = "";
        }

        //Modo Padrão
        if (consulta !== 'null') {

            getTable = `
            SELECT TRIM(RF.RDB$FIELD_NAME) AS COLUNA
                FROM RDB$RELATION_FIELDS RF
                WHERE RF.RDB$RELATION_NAME = '${consulta.toUpperCase()}'
                ORDER BY RF.RDB$FIELD_POSITION;`;
        } else {
            getTable = `SELECT ${getLimitsText} TRIM(RDB$RELATION_NAME) AS NOME_DAS_TABELAS
                            FROM RDB$RELATIONS
                            WHERE RDB$SYSTEM_FLAG = 0
                            AND RDB$VIEW_BLR IS NULL
                            ORDER BY RDB$RELATION_NAME;`
        }

        db.query(getTable, (err, result) => {
            db.detach(); //Libera a conexão com o banco de dados

            if (err) {
                console.error('Erro na consulta', err);
                return res.status(500).json({ error: 'Erro ao executar a consulta SQL.' });
            }
            res.status(200).json(result);
        });
    });
};

const getPesquisaTabelaColuns = async (req, res) => {
    Firebird.attach(options, async function (err, db) {
        const table = req.query.table || 'null';
        const coluns = req.query.coluns || 'null';
        const consulta = req.query.consulta || 'null';

        let getTable;
        let getColuns;
        let getQuery;

        if (err) {
            console.error('Erro ao conectar', err);
            return res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
        }

        if (coluns !== 'null') {
            getColuns = coluns.split(';')
            getQuery = ''

            getColuns.forEach((result, index) => {
                getQuery += `${result} LIKE '%${consulta}%'`

                if (index !== getColuns.length - 1) {
                    getQuery += ' OR '
                }
            })
        }

        getTable = `SELECT * FROM ${table} WHERE ${getQuery}`

        await db.query(getTable, (err, result) => {
            db.detach(); //Libera a conexão com o banco de dados

            if (err) {
                console.error('Erro na consulta', err);
                res.status(500).json({ error: 'Erro ao executar a consulta SQL.' });
            }
            res.status(200).json(result);
        })
    })
}


module.exports = {
    getContatos, getConsultaDados, getPesquisaTabelaColuns
};